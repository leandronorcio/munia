import { MouseEventHandler, forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { TextInput } from './TextInput';

export function DateInput({
  value,
  onChange,
  label,
  error,
  name,
}: {
  value: Date | null;
  onChange: (value: Date) => void;
  label: string;
  error?: string;
  name?: string;
}) {
  return (
    <ReactDatePicker
      selected={value}
      onChange={(date) => onChange(date!)}
      customInput={
        <CustomDateInput error={error} label={label} nameText={name} />
      }
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
    />
  );
}

const CustomDateInput = forwardRef<
  HTMLInputElement,
  {
    value?: string;
    error?: string;
    onClick?: MouseEventHandler<HTMLInputElement>;
    label: string;
    nameText?: string;
  }
>(({ value, error, onClick, label, nameText }, ref) => {
  return (
    <TextInput
      value={value}
      label={label}
      onSelect={onClick}
      ref={ref}
      errorMessage={error}
      isReadOnly
      name={nameText}
    />
  );
});
