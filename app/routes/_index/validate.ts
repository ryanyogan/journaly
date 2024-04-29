export function validate(data: Record<string, any>) {
  let { date, type, text, id } = data;

  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string"
  ) {
    throw new Error("Bad Request");
  }

  if (id && typeof id !== "string") {
    throw new Error("Bad Request");
  }

  return { date, type, text, id };
}
