import { isExtension } from "../utils";
import kpuApiClient from "./kpu-api-client";
import proxyApiClient from "./proxy-api-client";
import type { ApiClient } from "./types";

function getApiClient(): ApiClient {
  if (isExtension()) {
    return kpuApiClient;
  } else {
    return proxyApiClient;
  }
}

const apiClient = getApiClient();

export default apiClient;
