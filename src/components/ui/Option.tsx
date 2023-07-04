import { cn } from '@/lib/cn';
import { Check } from '@/svg_components';

export function Option({
  value,
  onChange,
  isSelected = false,
}: {
  value: string;
  onChange: (value: string) => void;
  isSelected?: boolean;
}) {
  return (
    <div
      onClick={() => {
        isSelected ? onChange('') : onChange(value);
      }}
      className="px-6 py-2 flex items-center gap-[18px] hover:bg-slate-200 "
    >
      <div
        className={cn(
          'w-6 h-6 rounded-md grid place-items-center',
          isSelected ? 'bg-violet-600' : 'bg-slate-300'
        )}
      >
        {isSelected && (
          <Check stroke="white" strokeWidth={4} width={18} height={18} />
        )}
      </div>
      <p className="text-lg text-gray-600 active:text-black">{value}</p>
    </div>
  );
}
