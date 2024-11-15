/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  LanguageModelV1,
  LanguageModelV1CallWarning,
  LanguageModelV1FinishReason,
  LanguageModelV1Prompt,
  LanguageModelV1StreamPart,
} from "@ai-sdk/provider";
import {
  type FetchFunction,
  combineHeaders,
  createJsonResponseHandler,
  postJsonToApi,
} from "@ai-sdk/provider-utils";
import { z } from "zod";
import { convertToMistralChatMessages } from "./convert-to-cohere-chat-messages";
import { mapMistralFinishReason } from "./map-cohere-finish-reason";
import type {
  CohereChatModelId,
  CohereChatSettings,
} from "./cohere-chat-settings";
import { mistralFailedResponseHandler } from "./cohere-error";
import { getResponseMetadata } from "./get-response-metadata";
import { prepareTools } from "./cohere-prepare-tools";
import { CohereClient } from "cohere-ai";

type CohereChatConfig = {
  provider: string;
  baseURL: string;
  headers: () => Record<string, string | undefined>;
  fetch?: FetchFunction;
};

interface CohereChatPrompt {
  message: string;
  chatHistory: Array<{
    message: string;
    role: "CHATBOT" | "SYSTEM" | "TOOL" | "USER";
  }>;
}

function convertToCohereChatMessages(
  prompt: LanguageModelV1Prompt,
): CohereChatPrompt {
  const message =
    (prompt.at(-1)?.content[0] as unknown as { text: string }).text ?? "";
  return {
    message: message,
    chatHistory: prompt.slice(0, -1).map((message) => {
      const role = message.role;
      const content = message.content;
      let msg: string;
      if (typeof content === "string") {
        msg = content;
      } else if (Array.isArray(content)) {
        msg = (content[0] as unknown as { text: string }).text ?? "";
      } else {
        msg = (content as unknown as { text: string }).text ?? "";
      }
      return {
        message: msg,
        role:
          role === "system"
            ? "SYSTEM"
            : role === "assistant"
              ? "CHATBOT"
              : role === "tool"
                ? "TOOL"
                : role === "user"
                  ? "USER"
                  : "USER",
      };
    }),
  };
}

export class CohereChatLanguageModel implements LanguageModelV1 {
  readonly specificationVersion = "v1";
  readonly defaultObjectGenerationMode = "json";
  readonly supportsImageUrls = false;

  readonly modelId: CohereChatModelId;
  readonly settings: CohereChatSettings;

  private readonly config: CohereChatConfig;

  constructor(
    modelId: CohereChatModelId,
    settings: CohereChatSettings,
    config: CohereChatConfig,
  ) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }

  get provider(): string {
    return this.config.provider;
  }

  private getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
  }: Parameters<LanguageModelV1["doGenerate"]>[0]) {
    const type = mode.type;

    const warnings: LanguageModelV1CallWarning[] = [];

    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK",
      });
    }

    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty",
      });
    }

    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty",
      });
    }

    if (stopSequences != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "stopSequences",
      });
    }

    if (
      responseFormat != null &&
      responseFormat.type === "json" &&
      responseFormat.schema != null
    ) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is not supported",
      });
    }

    const baseArgs = {
      // model id:
      model: this.modelId,

      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      random_seed: seed,

      // response format:
      response_format:
        responseFormat?.type === "json" ? { type: "json_object" } : undefined,

      // messages:
      messages: convertToMistralChatMessages(prompt),
    };

    switch (type) {
      case "regular": {
        const { tools, tool_choice, toolWarnings } = prepareTools(mode);

        return {
          args: { ...baseArgs, tools, tool_choice },
          warnings: [...warnings, ...toolWarnings],
        };
      }

      case "object-json": {
        return {
          args: {
            ...baseArgs,
            response_format: { type: "json_object" },
          },
          warnings,
        };
      }

      case "object-tool": {
        return {
          args: {
            ...baseArgs,
            tool_choice: "any",
            tools: [{ type: "function", function: mode.tool }],
          },
          warnings,
        };
      }

      default: {
        throw new Error(`Unsupported type`);
      }
    }
  }

  private getCohereArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
  }: Parameters<LanguageModelV1["doGenerate"]>[0]) {
    const type = mode.type;

    const warnings: LanguageModelV1CallWarning[] = [];

    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK",
      });
    }

    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty",
      });
    }

    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty",
      });
    }

    if (stopSequences != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "stopSequences",
      });
    }

    if (
      responseFormat != null &&
      responseFormat.type === "json" &&
      responseFormat.schema != null
    ) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is not supported",
      });
    }

    const baseArgs = {
      // model id:
      model: this.modelId,

      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      random_seed: seed,

      // response format:
      response_format:
        responseFormat?.type === "json" ? { type: "json_object" } : undefined,

      // messages:
      messages: convertToCohereChatMessages(prompt),
    };

    switch (type) {
      case "regular": {
        const { tools, tool_choice, toolWarnings } = prepareTools(mode);

        return {
          args: { ...baseArgs, tools, tool_choice },
          warnings: [...warnings, ...toolWarnings],
        };
      }

      case "object-json": {
        return {
          args: {
            ...baseArgs,
            response_format: { type: "json_object" },
          },
          warnings,
        };
      }

      case "object-tool": {
        return {
          args: {
            ...baseArgs,
            tool_choice: "any",
            tools: [{ type: "function", function: mode.tool }],
          },
          warnings,
        };
      }

      default: {
        throw new Error(`Unsupported type`);
      }
    }
  }

  async doGenerate(
    options: Parameters<LanguageModelV1["doGenerate"]>[0],
  ): Promise<Awaited<ReturnType<LanguageModelV1["doGenerate"]>>> {
    const { args, warnings } = this.getArgs(options);

    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat`,
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: mistralFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        mistralChatResponseSchema,
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch,
    });

    const { messages: rawPrompt, ...rawSettings } = args;
    const choice = response.choices[0];
    let text = choice?.message.content ?? undefined;

    // when there is a trailing assistant message, mistral will send the
    // content of that message again. we skip this repeated content to
    // avoid duplication, e.g. in continuation mode.
    const lastMessage = rawPrompt[rawPrompt.length - 1];
    if (
      lastMessage?.role === "assistant" &&
      text?.startsWith(lastMessage.content)
    ) {
      text = text.slice(lastMessage.content.length);
    }

    return {
      text,
      toolCalls: choice?.message.tool_calls?.map((toolCall) => ({
        toolCallType: "function",
        toolCallId: toolCall.id,
        toolName: toolCall.function.name,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        args: toolCall.function.arguments!,
      })),
      finishReason: mapMistralFinishReason(choice?.finish_reason),
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      request: { body: JSON.stringify(args) },
      response: getResponseMetadata(response),
      warnings,
    };
  }

  async doStream(
    options: Parameters<LanguageModelV1["doStream"]>[0],
  ): Promise<Awaited<ReturnType<LanguageModelV1["doStream"]>>> {
    const { args, warnings } = this.getCohereArgs(options);
    const client = new CohereClient({
      token: "5wZU5kVnNsBC19gZgtZCVOO05BnDzulU87hK8ESJ",
    });

    const stream = await client.chatStream({
      model: "command-r-08-2024",
      message: args.messages.message,
      temperature: 0.3,
      chatHistory: args.messages.chatHistory,
      promptTruncation: "AUTO",
      connectors: [
        { id: "web-search", options: { site: "https://www.kpu.ca/" } },
      ],
    });

    const tokenStream = new ReadableStream({
      async start(controller) {
        for await (const chat of stream) {
          if (chat.eventType === "text-generation") {
            controller.enqueue(chat.text);
          }
        }
        controller.close();
      },
    });
    // await readStreamInChunks(readableStream);
    // const body = { ...args, stream: true };

    // const { responseHeaders, value: response } = await postJsonToApi({
    //   url: `${this.config.baseURL}/chat`,
    //   headers: combineHeaders(this.config.headers(), options.headers),
    //   body,
    //   failedResponseHandler: mistralFailedResponseHandler,
    //   successfulResponseHandler: createEventSourceResponseHandler(
    //     mistralChatChunkSchema,
    //   ),
    //   abortSignal: options.abortSignal,
    //   fetch: this.config.fetch,
    // });

    // const { messages: rawPrompt, ...rawSettings } = args;

    const finishReason: LanguageModelV1FinishReason = "unknown";
    const usage: { promptTokens: number; completionTokens: number } = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN,
    };
    // let chunkNumber = 0;
    // let trimLeadingSpace = false;

    return {
      // stream: new ReadableStream({}),
      stream: tokenStream.pipeThrough(
        new TransformStream<string, LanguageModelV1StreamPart>({
          transform(chunk, controller) {
            if (chunk) {
              controller.enqueue({
                type: "text-delta",
                textDelta: chunk,
              });
            }
          },
          flush(controller) {
            controller.enqueue({ type: "finish", finishReason, usage });
          },
        }),
      ),
      rawCall: { rawPrompt: {}, rawSettings: {} },
      rawResponse: { headers: {} },
      request: { body: "" },
      warnings,
    };
  }
}

// limited version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
const mistralChatResponseSchema = z.object({
  id: z.string().nullish(),
  created: z.number().nullish(),
  model: z.string().nullish(),
  choices: z.array(
    z.object({
      message: z.object({
        role: z.literal("assistant"),
        content: z.string().nullable(),
        tool_calls: z
          .array(
            z.object({
              id: z.string(),
              function: z.object({ name: z.string(), arguments: z.string() }),
            }),
          )
          .nullish(),
      }),
      index: z.number(),
      finish_reason: z.string().nullish(),
    }),
  ),
  object: z.literal("chat.completion"),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
  }),
});

// limited version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
// const mistralChatChunkSchema = z.object({
//   id: z.string().nullish(),
//   created: z.number().nullish(),
//   model: z.string().nullish(),
//   choices: z.array(
//     z.object({
//       delta: z.object({
//         role: z.enum(["assistant"]).optional(),
//         content: z.string().nullish(),
//         tool_calls: z
//           .array(
//             z.object({
//               id: z.string(),
//               function: z.object({ name: z.string(), arguments: z.string() }),
//             }),
//           )
//           .nullish(),
//       }),
//       finish_reason: z.string().nullish(),
//       index: z.number(),
//     }),
//   ),
//   usage: z
//     .object({
//       prompt_tokens: z.number(),
//       completion_tokens: z.number(),
//     })
//     .nullish(),
// });
