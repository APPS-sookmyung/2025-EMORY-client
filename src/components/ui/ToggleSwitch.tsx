type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
};

export default function ToggleSwitch({ checked, onChange, className }: Props) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors duration-200 shadow-md
                  ${checked ? "bg-blue-600" : "bg-slate-300"} ${className ?? ""}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow
                    transition-transform duration-200
                    ${checked ? "translate-x-[22px]" : "translate-x-[2px]"}`}
      />
    </button>
  );
}