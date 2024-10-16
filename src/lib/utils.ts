import { type ClassValue, clsx } from "clsx";
// import { JSDOM } from "jsdom";
import { twMerge } from "tailwind-merge";
import type { ObjectElement } from "./kpu-api/types";
import {
  type HTMLElement as HTMLElementParser,
  type Node as NodeParser,
  NodeType as NodeTypeParser,
  parse,
} from "node-html-parser";
import { decode } from "html-entities";
// import { parseDocument, DomHandler } from "htmlparser2";
// import type { Element } from "htmlparser2";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveImageUrl(url: string) {
  // return url.startsWith("/service-images") ? chrome.runtime.getURL(url) : url;
  return url;
}

export function parseHtmlString(html: string) {
  if (typeof window === "undefined") return parseHtmlStringServer(html);
  return parseHtmlStringBrowser(html);
}

// type NodeObject = {
//   type: string;
//   attributes: Record<string, string>;
//   children: Array<
//     | { type: "text"; value: string | null }
//     | {
//         type: string;
//         attributes?: Record<string, string>;
//         children?: NodeObject["children"];
//       }
//   >;
// };
// const NodeType = {
//   TEXT_NODE: 3,
// };

function parseHtmlStringServer(html: string) {
  // Parse the HTML string into a DOM-like structure using htmlparser2
  const root = parse(html);

  const convertToObject = (node: HTMLElementParser | NodeParser) => {
    const obj = {
      type: node.rawTagName,
      attributes: {},
      children: [],
    } as ObjectElement;

    for (const child of node.childNodes) {
      if (child.nodeType === NodeTypeParser.TEXT_NODE) {
        obj.children?.push({
          type: "text",
          value: child.rawText ? decode(child.rawText) : undefined,
        });
      } else {
        obj.children?.push(convertToObject(child));
      }
    }

    return obj;
  };

  return convertToObject(root).children;
}

function parseHtmlStringBrowser(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const convertToObject = (node: HTMLElement | ChildNode) => {
    const obj = {
      type: node.nodeName,
      attributes: {},
      children: [],
    } as ObjectElement;

    if ((node as HTMLElement)?.attributes) {
      for (const attr of (node as HTMLElement).attributes) {
        obj.attributes[attr.name] = attr.value;
      }
    }

    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        obj.children?.push({
          type: "text",
          value: child.nodeValue ?? undefined,
        });
      } else {
        obj.children?.push(convertToObject(child));
      }
    }

    return obj;
  };

  return convertToObject(doc.body).children;
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getUsernameFromEmail(email: string) {
  const name = email.split("@")[0] ?? "justin.case";
  const firstName = capitalize(name.split(".")[0] ?? "Justin");
  const lastName = capitalize(name.split(".")[1] ?? "Case");

  return {
    username: `${firstName} ${lastName}`,
    greetingName: firstName,
    initials: firstName.charAt(0) + lastName.charAt(0),
  };
}

export function maybe<T>(data: T | null): T | undefined {
  return data ?? undefined;
}
