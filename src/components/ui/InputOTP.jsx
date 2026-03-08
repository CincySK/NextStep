import React, { createContext, useMemo, useRef, useState } from "react";
import { cn } from "./utils";

const OTPInputContext = createContext(null);

function InputOTP({
  className,
  containerClassName,
  value: controlledValue,
  onChange,
  maxLength = 6,
  disabled = false,
  children,
  ...props
}) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const value = String(isControlled ? controlledValue : internalValue).slice(0, maxLength);

  function updateValue(next) {
    const cleaned = String(next).replace(/\s+/g, "").slice(0, maxLength);
    if (!isControlled) setInternalValue(cleaned);
    if (onChange) onChange(cleaned);
  }

  const slots = useMemo(() => {
    return Array.from({ length: maxLength }, (_, index) => ({
      char: value[index] || "",
      hasFakeCaret: index === Math.min(value.length, maxLength - 1) && activeIndex === index && !disabled,
      isActive: index === activeIndex
    }));
  }, [value, maxLength, activeIndex, disabled]);

  return (
    <OTPInputContext.Provider value={{ slots }}>
      <div
        data-slot="input-otp"
        className={cn("ui-otp-root", className)}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={value}
          disabled={disabled}
          className="ui-otp-hidden-input"
          onChange={(event) => updateValue(event.target.value)}
          onFocus={() => setActiveIndex(Math.min(value.length, maxLength - 1))}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              setActiveIndex((prev) => Math.max(0, prev - 1));
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              setActiveIndex((prev) => Math.min(maxLength - 1, prev + 1));
            } else if (event.key === "Backspace") {
              setActiveIndex((prev) => Math.max(0, Math.min(prev, value.length - 1)));
            }
          }}
          {...props}
        />
        <div className={cn("ui-otp-container", containerClassName)}>
          {children}
        </div>
      </div>
    </OTPInputContext.Provider>
  );
}

function InputOTPGroup({ className, ...props }) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("ui-otp-group", className)}
      {...props}
    />
  );
}

function InputOTPSlot({ index, className, ...props }) {
  const context = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = context?.slots?.[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn("ui-otp-slot", isActive && "ui-otp-slot-active", className)}
      {...props}
    >
      {char}
      {hasFakeCaret && <span className="ui-otp-caret" />}
    </div>
  );
}

function InputOTPSeparator({ className, ...props }) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn("ui-otp-separator", className)}
      {...props}
    >
      -
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, OTPInputContext };
