import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { isToolCallEventType } from "@earendil-works/pi-coding-agent";

import type { ApprovalCtx, BashApprovalConfig } from "./models";
import {
  applyChoice,
  BLOCKED_BY_USER,
  buildPromptOptions,
  DENY,
  evaluateCommand,
  loadConfig,
} from "./utils";

function formatInvalidPatternsMessage(
  invalidPatterns: readonly string[],
): string {
  return `Ignored ${invalidPatterns.length} invalid regex pattern(s):\n  - ${invalidPatterns.join("\n  - ")}`;
}

function notifyInvalidPatterns(
  invalidPatterns: readonly string[],
  ctx: ApprovalCtx,
): void {
  if (invalidPatterns.length === 0) {
    return;
  }

  ctx.ui.notify(formatInvalidPatternsMessage(invalidPatterns), "error");
}

export default function (pi: ExtensionAPI) {
  let config: BashApprovalConfig = loadConfig();

  if (config.invalidPatterns.length > 0) {
    console.warn(
      `[pi-bash-approval] ${formatInvalidPatternsMessage(config.invalidPatterns)}`,
    );
  }

  pi.registerCommand("bash-approval-reload", {
    description:
      "Reload bash approval rules from ~/.pi/agent/.bash-approval and settings from ~/.pi/agent/settings.json",
    // eslint-disable-next-line @typescript-eslint/require-await -- API requires Promise<void>
    handler: async (_args, ctx) => {
      config = loadConfig();
      ctx.ui.notify(
        `Reloaded ${config.allowed.length} bash approval rule(s)`,
        "info",
      );
      notifyInvalidPatterns(config.invalidPatterns, ctx);
    },
  });

  pi.registerCommand("bash-approval-list", {
    description: "Show currently allowed bash command patterns",
    // eslint-disable-next-line @typescript-eslint/require-await -- API requires Promise<void>
    handler: async (_args, ctx) => {
      if (config.allowed.length === 0) {
        ctx.ui.notify("No bash approval rules configured", "info");
        notifyInvalidPatterns(config.invalidPatterns, ctx);
        return;
      }

      ctx.ui.notify(
        `Allowed bash patterns:\n  - ${config.allowed.join("\n  - ")}`,
        "info",
      );
      notifyInvalidPatterns(config.invalidPatterns, ctx);
    },
  });

  pi.on("tool_call", async (event, ctx) => {
    if (!isToolCallEventType("bash", event)) {
      return;
    }

    const command = String(event.input.command ?? "");
    const trimmedCommand = command.trim();

    if (!trimmedCommand) {
      return;
    }

    const evaluation = evaluateCommand(command, config);

    if (evaluation.allMatch) {
      return;
    }

    const { failingSegment } = evaluation;

    if (!ctx.hasUI) {
      return {
        block: true,
        reason: `Bash command not on allow-list (configure ~/.pi/agent/.bash-approval; split behavior in ~/.pi/agent/settings.json): ${trimmedCommand}`,
      };
    }

    const prompt = buildPromptOptions(trimmedCommand, failingSegment, config);

    const choice = await ctx.ui.select(
      `Approve bash command?\n\n  ${trimmedCommand}`,
      prompt.options,
    );

    if (!choice || choice === DENY) {
      return { block: true, reason: BLOCKED_BY_USER };
    }

    applyChoice(choice, trimmedCommand, prompt, config, ctx);
  });
}
