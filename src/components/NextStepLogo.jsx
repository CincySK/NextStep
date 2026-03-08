export default function NextStepLogo({ className = "" }) {
  return (
    <div className={`nextstep-logo ${className}`.trim()} aria-label="NextStep">
      <svg
        className="nextstep-logo-mark"
        viewBox="0 0 120 120"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nextstepMarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312eaa" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
        </defs>
        <path
          fill="url(#nextstepMarkGrad)"
          d="M16 102h40c23 0 42-16 46-38h-22c-3 10-13 16-24 16H16v22Zm0-38h54V42H48V26h22l-18-22-30 38h24v22H16v0Zm0-22h18V20H16v22Z"
        />
      </svg>
      <span className="nextstep-logo-text" aria-hidden="true">
        <span className="nextstep-logo-next">Next</span>
        <span className="nextstep-logo-step">Step</span>
      </span>
    </div>
  );
}
