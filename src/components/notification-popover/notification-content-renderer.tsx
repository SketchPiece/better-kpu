import type {
  Child,
  ContentStructure,
  ObjectElement,
} from "@/lib/kpu-api/types";
import { Fragment } from "react/jsx-runtime";

interface NotificationContentRendererProps {
  content: ContentStructure;
  showMore?: boolean;
}

const renderNode = (node: Child | ObjectElement): React.ReactNode => {
  const type = node.type.toLowerCase();
  if (type === "text") {
    return (node as Child)?.value;
  }

  if (type === "br") {
    return <br />;
  }

  if (type === "p") {
    return (
      <p className="my-2 text-sm">
        {node.children ? node.children.map((child) => renderNode(child)) : null}
      </p>
    );
  }

  const Tag = type as keyof JSX.IntrinsicElements;

  return (
    <Tag>
      {node.children
        ? node.children.map((child, index) => (
            <Fragment key={index}>{renderNode(child)}</Fragment>
          ))
        : null}
    </Tag>
  );
};

export default function NotificationContentRenderer({
  content,
  showMore = false,
}: NotificationContentRendererProps) {
  if (showMore) {
    return (
      <div>
        {content.map((node, index) => (
          <Fragment key={index}>{renderNode(node)}</Fragment>
        ))}
      </div>
    );
  }
  const node = content[0];
  if (!node) return null;
  return renderNode(node);
}
