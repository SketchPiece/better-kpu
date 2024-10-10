import proxyApiClient from "./proxy-api-client";
import type { ApiClient } from "./types";

function getApiClient(): ApiClient {
  return proxyApiClient;
}

const apiClient = getApiClient();

export default apiClient;
