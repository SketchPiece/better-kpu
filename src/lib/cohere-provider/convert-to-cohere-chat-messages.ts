/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type LanguageModelV1Prompt,
  // UnsupportedFunctionalityError,
} from "@ai-sdk/provider";
// import { convertUint8ArrayToBase64 } from "@ai-sdk/provider-utils";
import type { MistralPrompt } from "./cohere-chat-prompt";

export function convertToMistralChatMessages(
  _prompt: LanguageModelV1Prompt,
): MistralPrompt {
  return [];
}
