function format(value) {
  if (!Number.isFinite(value)) return String(value);
  if (Math.abs(value - Math.round(value)) < 1e-10) return String(Math.round(value));
  return String(Number(value.toFixed(6)));
}

function parseLinearEquation(input) {
  const compact = String(input ?? "")
    .toLowerCase()
    .replace(/^solve\s*/i, "")
    .replace(/\?+$/g, "")
    .replace(/\s+/g, "");

  const match = compact.match(/^([+\-]?\d*\.?\d*)x([+\-]\d+\.?\d*)?=([+\-]?\d+\.?\d*)$/);
  if (!match) return null;

  const coeffRaw = match[1];
  const constantRaw = match[2] ?? "+0";
  const rhsRaw = match[3];

  const a = coeffRaw === "" || coeffRaw === "+" ? 1 : coeffRaw === "-" ? -1 : Number(coeffRaw);
  const b = Number(constantRaw);
  const c = Number(rhsRaw);
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) return null;

  return { a, b, c };
}

export function solveSimpleAlgebra(input) {
  const eq = parseLinearEquation(input);
  if (!eq) return null;

  if (eq.a === 0) {
    return {
      text: "I cannot isolate x in this form because the x coefficient is 0. Try a form like 2x + 3 = 7."
    };
  }

  const movedConstant = eq.c - eq.b;
  const x = movedConstant / eq.a;

  return {
    text: [
      `Step 1: Move the constant term to the other side.`,
      `${format(eq.a)}x = ${format(eq.c)} ${eq.b >= 0 ? "-" : "+"} ${format(Math.abs(eq.b))} = ${format(movedConstant)}`,
      "",
      `Step 2: Divide both sides by ${format(eq.a)}.`,
      `x = ${format(movedConstant)} / ${format(eq.a)} = ${format(x)}`,
      "",
      `Final answer: x = ${format(x)}`
    ].join("\n")
  };
}
