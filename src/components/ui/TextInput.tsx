interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export function TextInput({ label, ...rest }: TextInputProps) {
  return (
    <div className="relative">
      <input
        {...rest}
        className="w-[320px] pt-8 py-2 px-5 bg-slate-100 outline-none rounded-2xl focus:ring-2 ring-black peer"
        placeholder=" "
        id={rest.id || 'generic-input'}
      />
      <label
        htmlFor={rest.id || 'generic-input'}
        className="cursor-text absolute z-0 left-5 transition-all text-gray-500 top-[9px] translate-y-0 text-sm peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-sm peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-placeholder-shown:text-lg"
      >
        {label}
      </label>
    </div>
  );
}
