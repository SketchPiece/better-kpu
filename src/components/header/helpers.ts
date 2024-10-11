export function includeValue<T extends string>(array: T[], value: T) {
  if (array.includes(value)) {
    return [...array];
  }
  return [...array, value];
}

export function excludeValue<T extends string>(array: T[], value: T) {
  return array.filter((item) => item !== value);
}
