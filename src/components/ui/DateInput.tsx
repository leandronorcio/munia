import { MouseEventHandler, forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { TextInput } from './TextInput';

export function DateInput({
  value,
  onChange,
  placeholderText,
  error,
  name,
}: {
  value: Date | null;
  onChange: (value: Date) => void;
  placeholderText: string;
  error?: string;
  name?: string;
}) {
  return (
    <ReactDatePicker
      selected={value}
      onChange={(date) => onChange(date!)}
      customInput={
        <CustomDateInput
          error={error}
          placeholderText={placeholderText}
          nameText={name}
        />
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
    placeholderText: string;
    nameText?: string;
  }
>(({ value, error, onClick, placeholderText, nameText }, ref) => {
  return (
    <TextInput
      value={value}
      placeholder={placeholderText}
      onClick={onClick}
      ref={ref}
      error={error}
      readOnly
      name={nameText}
    />
  );
});
