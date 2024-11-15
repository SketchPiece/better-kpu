export type CohereChatModelId = "command-r-08-2024" | (string & {});

export interface CohereChatSettings {
  connectors?: { id: string; options?: Record<string, unknown> }[];
}
