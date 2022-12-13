import { useEffect, useState } from 'react';
import { InputLabel, MenuItem, Select, SelectChangeEvent, SelectProps } from '@mui/material';
import { useField } from '@unform/core';

export interface VSelectElement {
  label: string;
  id: string;
}

type VSelectProps = SelectProps & {
  name: string;
  options?: VSelectElement[];
}

export const VSelectField: React.FC<VSelectProps> = ({ name, options, ...rest }) => {
  const { fieldName, registerField, error, clearError } = useField(name);

  const [value, setValue] = useState<string>('');

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(String(newValue)),
    });
  }, [registerField, fieldName, value]);


  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };


  return (
    <>
      <InputLabel id={`${name}-label`}>{rest?.label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        {...rest}
        error={!!error}
        value={value}
        onChange={(e) => setValue(String(e.target?.value))}
        onKeyDown={(e) => { error && clearError(); rest.onKeyDown?.(e); }}
      >
        <MenuItem value={''}>
          <em>Não informado</em>  
        </MenuItem>
        {options?.map((option) => <MenuItem key={String(option.id)} value={String(option.id)}>{option.label}</MenuItem>)};
      </Select>
    </>
  );
};