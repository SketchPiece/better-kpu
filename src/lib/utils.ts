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
  if (isExtension()) {
    return url.startsWith("/service-images") ? chrome.runtime.getURL(url) : url;
  } else {
    return url;
  }
}

export function parseHtmlString(html: string) {
  if (typeof window === "undefined") return parseHtmlStringServer(html);
  return parseHtmlStringBrowser(html);
}

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

export function maybe<T>(data: T | null): T | undefined {
  return data ?? undefined;
}

export function isExtension() {
  return typeof process === "undefined";
}
