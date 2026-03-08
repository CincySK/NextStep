import React, { useMemo, useState } from "react";
import { cn } from "./utils";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeValues(value, defaultValue, min, max) {
  if (Array.isArray(value) && value.length) return value.map((v) => clamp(Number(v), min, max));
  if (Array.isArray(defaultValue) && defaultValue.length) return defaultValue.map((v) => clamp(Number(v), min, max));
  return [min];
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  ...props
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(() => normalizeValues(undefined, defaultValue, min, max));
  const values = useMemo(
    () => normalizeValues(isControlled ? value : internal, defaultValue, min, max),
    [isControlled, value, internal, defaultValue, min, max]
  );

  const sorted = [...values].sort((a, b) => a - b);
  const low = sorted[0] ?? min;
  const high = sorted.length > 1 ? sorted[sorted.length - 1] : low;
  const lowPct = ((low - min) / (max - min || 1)) * 100;
  const highPct = ((high - min) / (max - min || 1)) * 100;

  function emit(next) {
    const clean = next.map((n) => clamp(Number(n), min, max));
    if (!isControlled) setInternal(clean);
    if (onValueChange) onValueChange(clean);
  }

  function handleLowChange(event) {
    const nextLow = Number(event.target.value);
    if (values.length > 1) emit([Math.min(nextLow, high), high]);
    else emit([nextLow]);
  }

  function handleHighChange(event) {
    const nextHigh = Number(event.target.value);
    emit([Math.min(low, nextHigh), Math.max(low, nextHigh)]);
  }

  return (
    <div
      data-slot="slider"
      className={cn("ui-slider", className)}
      data-disabled={disabled ? "true" : "false"}
      {...props}
    >
      <div data-slot="slider-track" className="ui-slider-track">
        <div
          data-slot="slider-range"
          className="ui-slider-range"
          style={{
            left: `${values.length > 1 ? lowPct : 0}%`,
            width: `${values.length > 1 ? highPct - lowPct : lowPct}%`
          }}
        />
      </div>

      <input
        type="range"
        className="ui-slider-input"
        min={min}
        max={max}
        step={step}
        value={low}
        disabled={disabled}
        onChange={handleLowChange}
      />

      {values.length > 1 ? (
        <input
          type="range"
          className="ui-slider-input"
          min={min}
          max={max}
          step={step}
          value={high}
          disabled={disabled}
          onChange={handleHighChange}
        />
      ) : null}
    </div>
  );
}

export { Slider };
