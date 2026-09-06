type HistoryPanelProps = {
  items: { prompt: string }[];
  currentIndex: number;
  collapsed: boolean;
  onToggle: () => void;
  onSelect: (index: number) => void;
};

export function HistoryPanel({
  items,
  currentIndex,
  collapsed,
  onToggle,
  onSelect,
}: HistoryPanelProps) {
  return (
    <aside
      className={`flex shrink-0 flex-col overflow-hidden bg-white transition-[width] duration-200 ${
        collapsed ? 'w-12' : 'w-full lg:w-[240px]'
      }`}
      style={{
        boxShadow: '0 4px 16px rgba(44, 52, 68, 0.08)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand history' : 'Collapse history'}
        className="flex h-12 w-12 items-center justify-center"
        style={{ color: '#2C3444' }}
      >
        {collapsed ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="mb-2 px-2 text-xs" style={{ color: '#7A8496' }}>History</div>
          <div className="space-y-1">
            {items.map((item, index) => {
              const active = index === currentIndex;
              return (
                <button
                  key={`${item.prompt}-${index}`}
                  type="button"
                  onClick={() => onSelect(index)}
                  className="w-full truncate rounded-xl px-3 py-2 text-left text-sm"
                  style={{
                    color: '#2C3444',
                    background: active ? 'rgba(232, 98, 43, 0.1)' : 'transparent',
                    borderLeft: active ? '3px solid #E8622B' : '3px solid transparent',
                  }}
                >
                  {item.prompt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
