import { MouseEventHandler, forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { TextInput } from './TextInput';

const CustomDateInput = forwardRef<
  HTMLInputElement,
  {
    value?: string;
    error?: string;
    onClick?: MouseEventHandler<HTMLInputElement>;
  }
>(({ value, error, onClick }, ref) => (
  <TextInput
    value={value}
    placeholder="Birthdate"
    onClick={onClick}
    ref={ref}
    error={error}
  />
));

export function DateInput({
  value,
  error,
  onChange,
}: {
  value: Date | null;
  error?: string;
  onChange: (value: Date) => void;
}) {
  return (
    <ReactDatePicker
      selected={value}
      onChange={(date) => onChange(date!)}
      customInput={<CustomDateInput error={error} />}
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
    />
  );
}
