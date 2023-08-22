import { ArrowChevronDown } from '@/svg_components';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TextInput } from './TextInput';
import { Option } from './Option';
import { cn } from '@/lib/cn';

export function Select({
  options,
  value,
  label,
  onChange,
  error,
  name,
}: {
  options: any[];
  value: string;
  label: string;
  onChange: (value: string) => void;
  error?: string;
  name?: string;
}) {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide the DropDown when clicked outside.
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current === null) return;
      if (!ref.current.contains(e.target as Node)) {
        setOptionsVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () =>
      document.removeEventListener('click', handleClickOutside, true);
  }, []);

  return (
    <div className="relative w-[320px] cursor-pointer" ref={ref}>
      <div className="relative w-full">
        <TextInput
          value={value}
          label={label}
          onSelect={() => setOptionsVisible((prev) => !prev)}
          isReadOnly
          errorMessage={error}
          name={name}
        />
        <div className="absolute right-5 top-5 z-10">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: optionsVisible ? 180 : 0 }}
          >
            <ArrowChevronDown
              className={cn(error ? 'stroke-red-900' : 'stroke-gray-500')}
              width={24}
              height={24}
              onClick={() => setOptionsVisible((prev) => !prev)}
            />
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: optionsVisible ? 1 : 0, originY: 0 }}
        className="absolute top-[110%] z-10 w-full rounded-xl border border-gray-300 bg-slate-100 py-2"
        onClick={() => setOptionsVisible((prev) => !prev)}
      >
        {options.map((option) => (
          <Option
            key={option}
            value={option}
            onChange={onChange}
            isSelected={option === value}
          />
        ))}
      </motion.div>
    </div>
  );
}
