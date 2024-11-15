import type {
  EmbeddingModelV1,
  LanguageModelV1,
  ProviderV1,
} from "@ai-sdk/provider";
import {
  type FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from "@ai-sdk/provider-utils";
import { CohereChatLanguageModel } from "./cohere-chat-language-model";
import type {
  CohereChatModelId,
  CohereChatSettings,
} from "./cohere-chat-settings";
import { MistralEmbeddingModel } from "./cohere-embedding-model";
import type {
  MistralEmbeddingModelId,
  MistralEmbeddingSettings,
} from "./cohere-embedding-settings";

export interface CohereProvider extends ProviderV1 {
  (modelId: CohereChatModelId, settings?: CohereChatSettings): LanguageModelV1;

  /**
Creates a model for text generation.
*/
  languageModel(
    modelId: CohereChatModelId,
    settings?: CohereChatSettings,
  ): LanguageModelV1;

  /**
Creates a model for text generation.
*/
  chat(
    modelId: CohereChatModelId,
    settings?: CohereChatSettings,
  ): LanguageModelV1;

  /**
@deprecated Use `textEmbeddingModel()` instead.
   */
  embedding(
    modelId: MistralEmbeddingModelId,
    settings?: MistralEmbeddingSettings,
  ): EmbeddingModelV1<string>;

  /**
@deprecated Use `textEmbeddingModel()` instead.
   */
  textEmbedding(
    modelId: MistralEmbeddingModelId,
    settings?: MistralEmbeddingSettings,
  ): EmbeddingModelV1<string>;

  textEmbeddingModel: (
    modelId: MistralEmbeddingModelId,
    settings?: MistralEmbeddingSettings,
  ) => EmbeddingModelV1<string>;
}

export interface CohereProviderSettings {
  /**
Use a different URL prefix for API calls, e.g. to use proxy servers.
The default prefix is `https://api.mistral.ai/v1`.
   */
  baseURL?: string;

  /**
API key that is being send using the `Authorization` header.
It defaults to the `MISTRAL_API_KEY` environment variable.
   */
  apiKey?: string;

  /**
Custom headers to include in the requests.
     */
  headers?: Record<string, string>;

  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
    */
  fetch?: FetchFunction;
}

/**
Create a Mistral AI provider instance.
 */
export function createCohere(
  options: CohereProviderSettings = {},
): CohereProvider {
  const baseURL =
    withoutTrailingSlash(options.baseURL) ?? "https://api.cohere.com/v1/pipa"; // ! please remove pipa 😭

  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "COHERE_API_KEY",
      description: "Cohere",
    })}`,
    ...options.headers,
  });

  const createChatModel = (
    modelId: CohereChatModelId,
    settings: CohereChatSettings = {},
  ) =>
    new CohereChatLanguageModel(modelId, settings, {
      provider: "cohere.chat",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
    });

  const createEmbeddingModel = (
    modelId: MistralEmbeddingModelId,
    settings: MistralEmbeddingSettings = {},
  ) =>
    new MistralEmbeddingModel(modelId, settings, {
      provider: "mistral.embedding",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
    });

  const provider = function (
    modelId: CohereChatModelId,
    settings?: CohereChatSettings,
  ) {
    if (new.target) {
      throw new Error(
        "The Mistral model function cannot be called with the new keyword.",
      );
    }

    return createChatModel(modelId, settings);
  };

  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;

  return provider as CohereProvider;
}

/**
Default Mistral provider instance.
 */
export const cohere = createCohere();
