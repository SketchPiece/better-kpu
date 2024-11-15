import type { ComponentProps } from "react";

export default function AssistantAvatar(props: ComponentProps<"svg">) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M28.3118 26.5716H7.54297V24.3439H16.5304L7.54297 17.324V9.42871L17.9269 18.186L28.3118 9.42871V17.324L19.3243 24.3439H28.3118V26.5716Z"
        fill="#8C2332"
      />
    </svg>
  );
}
