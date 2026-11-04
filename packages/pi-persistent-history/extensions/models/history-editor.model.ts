import type { EditorComponent } from "@earendil-works/pi-tui";

export type FocusedTui = {
  readonly focusedComponent?: unknown;
};

export type HistoryEditor = EditorComponent & {
  readonly addToHistory?: (text: string) => void;
  readonly history?: readonly string[];
};

export type CustomEditorLike = HistoryEditor & {
  readonly actionHandlers?: unknown;
  onExtensionShortcut?: (data: string) => boolean | undefined;
};
