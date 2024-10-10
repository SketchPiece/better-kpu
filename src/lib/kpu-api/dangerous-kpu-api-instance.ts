import axios from "axios";

const KPU_API_URL = "https://one.kpu.ca";

const isServer: boolean = typeof window === "undefined";

/** This is a dangerous https client that is used to bypass the certificate problems on the server */
function createDangerousKpuApiInstance() {
  if (isServer) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports
    const https = require("https") as typeof import("https");
    const dangerousAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    const axiosInstance = axios.create({
      httpsAgent: dangerousAgent,
      baseURL: KPU_API_URL,
    });

    return axiosInstance;
  } else {
    return axios.create({
      baseURL: KPU_API_URL,
    });
  }
}

export const dangerousKpuApiInstance = createDangerousKpuApiInstance();
