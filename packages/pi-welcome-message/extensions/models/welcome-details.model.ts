import type { WelcomeMessageHeader } from "./welcome-header.model";

/**
 * Extension-specific metadata for the welcome custom message.
 * `details` is renderer-only and is not sent to the LLM, unlike `content`.
 */
export type WelcomeMessageDetails = {
  readonly summary: string;
  readonly header: WelcomeMessageHeader | null;
};
