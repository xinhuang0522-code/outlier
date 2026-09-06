type ChatBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  buttonLabel: string;
  disabled?: boolean;
  size?: 'default' | 'large';
  compact?: boolean;
  stacked?: boolean;
};

export function ChatBar({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonLabel,
  disabled,
  size = 'default',
  compact,
  stacked,
}: ChatBarProps) {
  const large = size === 'large';

  const input = (
    <input
      className={`float-field w-full outline-none ${large ? 'px-6 py-4 text-xl' : 'px-5 py-3'}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSubmit();
      }}
      placeholder={placeholder}
    />
  );

  const button = (
    <button
      onClick={onSubmit}
      disabled={disabled}
      aria-label={buttonLabel}
      className={`float-btn font-bold disabled:opacity-60 ${
        compact
          ? 'flex h-12 w-12 shrink-0 items-center justify-center p-0'
          : large
            ? `py-4 text-lg ${stacked ? 'w-full' : 'px-8'}`
            : 'px-6 py-3'
      }`}
    >
      {compact ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        buttonLabel
      )}
    </button>
  );

  if (stacked) {
    return (
      <div className="flex w-full flex-col gap-4">
        {input}
        {button}
      </div>
    );
  }

  return (
    <div className={`flex w-full ${large ? 'gap-4' : 'gap-3'}`}>
      <div className="flex-1">{input}</div>
      {button}
    </div>
  );
}
