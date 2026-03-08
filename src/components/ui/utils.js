function flatten(input, out) {
  if (!input) return;

  if (typeof input === "string" || typeof input === "number") {
    out.push(String(input));
    return;
  }

  if (Array.isArray(input)) {
    input.forEach((item) => flatten(item, out));
    return;
  }

  if (typeof input === "object") {
    Object.entries(input).forEach(([key, value]) => {
      if (value) out.push(key);
    });
  }
}

export function cn(...inputs) {
  const classes = [];
  inputs.forEach((item) => flatten(item, classes));
  return classes.join(" ").trim();
}
