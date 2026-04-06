type TemplateToggleProps = {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
};

export function TemplateToggle({ checked, label, onChange }: TemplateToggleProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[11px] text-gray-400">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-[#ea728c]' : 'bg-gray-600'}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
