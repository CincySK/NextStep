function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return String(value);
  if (Math.abs(value - Math.round(value)) < 1e-10) return String(Math.round(value));
  return String(Number(value.toFixed(6)));
}

function buildMathOutput(answer, details = []) {
  return [
    `Answer: ${answer}`,
    ...details.map((line) => `- ${line}`)
  ].join("\n");
}

function normalizeWords(input) {
  return String(input ?? "")
    .toLowerCase()
    .replace(/multiplied by|times/g, "*")
    .replace(/divided by|over/g, "/")
    .replace(/plus/g, "+")
    .replace(/minus/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSimpleBinaryExpression(input) {
  const text = normalizeWords(input).replace(/\s/g, "");
  const match = text.match(/^(-?\d+(?:\.\d+)?)([+\-*/])(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const left = toNumber(match[1]);
  const op = match[2];
  const right = toNumber(match[3]);
  if (left === null || right === null) return null;
  if (op === "/" && right === 0) return { error: "You cannot divide by 0." };
  const value = op === "+"
    ? left + right
    : op === "-"
      ? left - right
      : op === "*"
        ? left * right
        : left / right;
  return { left, op, right, value };
}

function parseFraction(input) {
  const text = normalizeWords(input).replace(/\s/g, "");
  const match = text.match(/^(-?\d+)\/(-?\d+)$/);
  if (!match) return null;
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (denominator === 0) return { error: "A fraction cannot have 0 in the denominator." };
  return { numerator, denominator };
}

function simplifyFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return {
    numerator: (numerator / divisor) * sign,
    denominator: Math.abs(denominator / divisor)
  };
}

function fractionExplainer(numerator, denominator) {
  const simplified = simplifyFraction(numerator, denominator);
  const decimal = numerator / denominator;
  const percent = decimal * 100;
  return buildMathOutput(
    `${simplified.numerator}/${simplified.denominator}`,
    [
      `${numerator}/${denominator} means ${numerator} divided by ${denominator}.`,
      `${numerator} / ${denominator} = ${formatNumber(decimal)}`,
      `Decimal form: ${formatNumber(decimal)}`,
      `Percent form: ${formatNumber(percent)}%`
    ]
  );
}

function parsePercentOf(input) {
  const text = normalizeWords(input);
  const match = text.match(/(-?\d+(?:\.\d+)?)%\s*(?:of)\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  const percent = Number(match[1]);
  const base = Number(match[2]);
  if (!Number.isFinite(percent) || !Number.isFinite(base)) return null;
  return { percent, base, value: (percent / 100) * base };
}

function parseDecimalAsFraction(input) {
  const text = normalizeWords(input);
  const match = text.match(/(-?\d+(?:\.\d+)?)\s*(?:as a fraction|to fraction)/);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return null;
  const str = String(match[1]);
  const decimals = (str.split(".")[1] || "").length;
  if (decimals === 0) return { numerator: value, denominator: 1 };
  const denominator = 10 ** decimals;
  const numerator = Math.round(value * denominator);
  return simplifyFraction(numerator, denominator);
}

function parseSimplifyFraction(input) {
  const text = normalizeWords(input);
  const match = text.match(/simplify\s*(-?\d+)\s*\/\s*(-?\d+)/);
  if (!match) return null;
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (denominator === 0) return { error: "A fraction cannot have 0 in the denominator." };
  return { numerator, denominator, simplified: simplifyFraction(numerator, denominator) };
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
  const bRaw = match[2] ?? "+0";
  const rhsRaw = match[3];

  const a = coeffRaw === "" || coeffRaw === "+" ? 1 : coeffRaw === "-" ? -1 : Number(coeffRaw);
  const b = Number(bRaw);
  const c = Number(rhsRaw);
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) return null;
  return { a, b, c };
}

export function handleAlgebra(input) {
  const eq = parseLinearEquation(input);
  if (!eq) return null;
  if (eq.a === 0) return { text: "This equation does not have a single x solution because the x coefficient is 0." };
  const rhsAfterMove = eq.c - eq.b;
  const x = rhsAfterMove / eq.a;
  return {
    text: buildMathOutput(
      `x = ${formatNumber(x)}`,
      [
        `Start with ${formatNumber(eq.a)}x ${eq.b >= 0 ? "+" : "-"} ${formatNumber(Math.abs(eq.b))} = ${formatNumber(eq.c)}`,
        `Move the constant: ${formatNumber(eq.a)}x = ${formatNumber(rhsAfterMove)}`,
        `Divide by ${formatNumber(eq.a)}`
      ]
    )
  };
}

export function handleBasicMath(input) {
  const raw = String(input ?? "").trim();
  if (!raw) return null;

  const simplify = parseSimplifyFraction(raw);
  if (simplify) {
    if (simplify.error) return { text: simplify.error };
    return {
      text: buildMathOutput(
        `${simplify.simplified.numerator}/${simplify.simplified.denominator}`,
        [`${simplify.numerator}/${simplify.denominator} simplified by dividing top and bottom by ${gcd(simplify.numerator, simplify.denominator)}.`]
      )
    };
  }

  const fraction = parseFraction(raw);
  if (fraction) {
    if (fraction.error) return { text: fraction.error };
    return { text: fractionExplainer(fraction.numerator, fraction.denominator) };
  }

  const percentOf = parsePercentOf(raw);
  if (percentOf) {
    return {
      text: buildMathOutput(
        formatNumber(percentOf.value),
        [`(${formatNumber(percentOf.percent)} / 100) * ${formatNumber(percentOf.base)} = ${formatNumber(percentOf.value)}`]
      )
    };
  }

  const asFraction = parseDecimalAsFraction(raw);
  if (asFraction) {
    const value = raw.match(/-?\d+(?:\.\d+)?/)?.[0] ?? "That decimal";
    return {
      text: buildMathOutput(`${asFraction.numerator}/${asFraction.denominator}`, [`${value} converted to a fraction in simplest form.`])
    };
  }

  const binary = parseSimpleBinaryExpression(raw);
  if (binary) {
    if (binary.error) return { text: binary.error };
    return {
      text: buildMathOutput(
        formatNumber(binary.value),
        [`${formatNumber(binary.left)} ${binary.op} ${formatNumber(binary.right)} = ${formatNumber(binary.value)}`]
      )
    };
  }

  if (/^-?\d+(?:\.\d+)?%$/.test(raw)) {
    const n = Number(raw.replace("%", ""));
    return {
      text: buildMathOutput(formatNumber(n / 100), [`${formatNumber(n)}% means ${formatNumber(n)} / 100.`])
    };
  }

  if (/^-?\d+(?:\.\d+)?$/.test(raw)) {
    const n = Number(raw);
    return {
      text: buildMathOutput(
        formatNumber(n),
        [`If you want a calculation, try: ${formatNumber(n)} / 2 or ${formatNumber(n)}% of 50.`]
      )
    };
  }

  return null;
}

export function inferFollowUpMath(message, recentHistory = []) {
  const trimmed = String(message ?? "").trim();
  if (!/^\d+$/.test(trimmed)) return null;

  const previousUser = [...recentHistory].reverse().find((item) => item.role === "user" && item.text !== trimmed);
  if (!previousUser?.text) return null;

  const frac = previousUser.text.match(/(-?\d+)\s*\/\s*(-?\d+)/);
  if (frac) {
    const denominator = Number(frac[2]);
    if (denominator !== 0) {
      const numerator = Number(trimmed);
      const decimal = numerator / denominator;
      return {
        text: buildMathOutput(
          `${numerator}/${denominator} = ${formatNumber(decimal)}`,
          [
            `${numerator}/${denominator} = ${formatNumber(decimal * 100)}%`,
            `If you meant something else by "${trimmed}", send the full expression.`
          ]
        )
      };
    }
  }

  return null;
}
