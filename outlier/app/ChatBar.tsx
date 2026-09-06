type ChatBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  buttonLabel: string;
  disabled?: boolean;
  size?: 'default' | 'large';
  compact?: boolean;
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
}: ChatBarProps) {
  const large = size === 'large';

  return (
    <div className={`flex w-full ${large ? 'gap-4' : 'gap-3'}`}>
      <input
        className={`float-field flex-1 outline-none ${large ? 'px-6 py-4 text-xl' : 'px-5 py-3'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
        }}
        placeholder={placeholder}
      />
      <button
        onClick={onSubmit}
        disabled={disabled}
        aria-label={buttonLabel}
        className={`float-btn font-bold disabled:opacity-60 ${
          compact
            ? 'flex h-12 w-12 shrink-0 items-center justify-center p-0'
            : large
              ? 'px-8 py-4 text-lg'
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
    </div>
  );
}
