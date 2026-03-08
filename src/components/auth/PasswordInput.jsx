import { useState } from "react";

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  inputValid = false,
  autoComplete = "current-password",
  required = true
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <div className="password-wrap">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          data-valid={inputValid ? "true" : "false"}
        />
        <button type="button" className="password-toggle" onClick={() => setVisible((prev) => !prev)}>
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}
