import { trpcClient } from "@/trpc/react";
import type { ApiClient, UpdateFavorite } from "./types";

const fakeNotifications = [
  {
    id: 1481,
    title: "Under Maintenance: Banner",
    description:
      "<p>Banner is currently undergoing maintenance from Friday, June 14 at 8:00 PM to Sunday, June 16 at 12:00 PM.</p>\n<p>The following services are not currently available</p>\n<ul>\n<li>Admin Pages (Banner 9)</li>\n<li>Banner 9 apps (Student Registration Self-Service, Student Profile, Faculty Self-Service, Employee Dashboard, BDM, Communication Management)</li>\n<li>Online Self-Service (OSS.KPU.CA)</li>\n<li>FAST (Finance, HR, WebReq, PCARD, Budget, Student, etc)</li>\n<li>Integration to and from Banner (Elevate, EPBC, Degree Works, AdAstra, Moodle, etc.)</li>\n<li>Other Online Self-Services (Adobe Creative Cloud Consent, Submit SIN, View Personalized Booklist, KPU Card Request)</li>\n</ul>",
    content: [
      {
        type: "p",
        attributes: {},
        children: [
          {
            type: "text",
            value:
              "Banner is currently undergoing maintenance from Friday, June 14 at 8:00 PM to Sunday, June 16 at 12:00 PM.",
          },
        ],
      },
      {
        type: "text",
        value: "\n",
      },
      {
        type: "p",
        attributes: {},
        children: [
          {
            type: "text",
            value: "The following services are not currently available",
          },
        ],
      },
      {
        type: "text",
        value: "\n",
      },
      {
        type: "ul",
        attributes: {},
        children: [
          {
            type: "text",
            value: "\n",
          },
          {
            type: "li",
            attributes: {},
            children: [
              {
                type: "text",
                value: "Admin Pages (Banner 9)",
              },
            ],
          },
          {
            type: "text",
            value: "\n",
          },
          {
            type: "li",
            attributes: {},
            children: [
              {
                type: "text",
                value:
                  "Banner 9 apps (Student Registration Self-Service, Student Profile, Faculty Self-Service, Employee Dashboard, BDM, Communication Management)",
              },
            ],
          },
          {
            type: "text",
            value: "\n",
          },
          {
            type: "li",
            attributes: {},
            children: [
              {
                type: "text",
                value: "Online Self-Service (OSS.KPU.CA)",
              },
            ],
          },
          {
            type: "text",
            value: "\n",
          },
          {
            type: "li",
            attributes: {},
            children: [
              {
                type: "text",
                value:
                  "FAST (Finance, HR, WebReq, PCARD, Budget, Student, etc)",
              },
            ],
          },
          {
            type: "text",
            value: "\n",
          },
          {
            type: "li",
            attributes: {},
            children: [
              {
                type: "text",
                value:
                  "Integration to and from Banner (Elevate, EPBC, Degree Works, AdAstra, Moodle, etc.)",
              },
            ],
          },
          {
            type: "text",
            value: "\n",
          },
          {
            type: "li",
            attributes: {},
            children: [
              {
                type: "text",
                value:
                  "Other Online Self-Services (Adobe Creative Cloud Consent, Submit SIN, View Personalized Booklist, KPU Card Request)",
              },
            ],
          },
          {
            type: "text",
            value: "\n",
          },
        ],
      },
    ],
  },
];

const proxyApiClient: ApiClient = {
  getAllServices: ({ pageNumber = 0, searchQuery, category, roles }) => {
    return trpcClient.kpu.getAllServices.query({
      pageNumber,
      searchQuery,
      category: category ?? undefined,
      roles,
    });
  },
  getQuickServices: (params = {}) => {
    return trpcClient.kpu.getQuickServices.query(params);
  },
  getUserProfile: async () => {
    return null;
  },
  updateFavorite: (params: UpdateFavorite) => {
    return trpcClient.kpu.updateFavorite.mutate(params);
  },
  updateRecent: (params: UpdateFavorite) => {
    return trpcClient.kpu.updateRecent.mutate(params);
  },
  getNotifications: async (params) => {
    return params?.showFake
      ? fakeNotifications
      : trpcClient.kpu.getNotifications.query();
  },
};

export default proxyApiClient;
