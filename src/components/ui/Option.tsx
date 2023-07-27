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
      className="flex items-center gap-[18px] px-6 py-2 hover:bg-slate-200 "
    >
      <div
        className={cn(
          'grid h-6 w-6 place-items-center rounded-md',
          isSelected ? 'bg-violet-600' : 'bg-slate-300',
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
