export type CompiledRule =
  | { readonly kind: "exact"; readonly raw: string; readonly literal: string }
  | {
      readonly kind: "prefixGlob";
      readonly raw: string;
      readonly prefix: string;
    }
  | {
      readonly kind: "trailingGlob";
      readonly raw: string;
      readonly prefix: string;
    }
  | { readonly kind: "regex"; readonly raw: string; readonly regex: RegExp };

export type BashApprovalConfig = {
  allowed: string[];
  splitChains: boolean;
  compiledRules: CompiledRule[];
  invalidPatterns: string[];
};

export type BashApprovalSettings = {
  readonly splitChains?: unknown;
};

export type GlobalSettings = {
  readonly bashApproval?: BashApprovalSettings;
};

export type SplitState = {
  commandSubstitutionDepth: number;
  current: string;
  parts: string[];
  quote: '"' | "'" | null;
};

export type NotifyLevel = "info" | "error";

export type ApprovalCtx = {
  readonly hasUI: boolean;
  readonly ui: {
    readonly notify: (message: string, level: NotifyLevel) => void;
    readonly select: (
      message: string,
      options: string[],
    ) => Promise<string | null | undefined>;
  };
};

export type PromptOptions = {
  readonly options: string[];
  readonly exactLabel: string;
  readonly prefixLabel: string | null;
  readonly suggested: string | null;
};

export type CommandEvaluation =
  | { allMatch: true }
  | { allMatch: false; failingSegment: string };
