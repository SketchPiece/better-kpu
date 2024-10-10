import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSubmit<T extends (...args: any[]) => void>(onSubmit?: T) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.();
  };
  return handleSubmit;
}

export function useInput(defaultValue = "") {
  const [value, setValue] = useState(defaultValue);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === "string") return setValue(e);
    setValue(e.target.value);
  };
  return [value, { value, onChange: handleChange }] as const;
}
