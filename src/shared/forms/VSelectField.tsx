import { useEffect, useState } from 'react';

import { SelectProps, InputLabel, Select, MenuItem, FormHelperText, FormControl } from '@mui/material';
import { useField } from '@unform/core';

export interface VSelectOption {
  value: string;
  label: string;
}

type VSelectProps = SelectProps & {
    name: string;
    options: VSelectOption[];
}

export const VSelectField: React.FC<VSelectProps> = ({ ...params }) => {
  const { fieldName, registerField, error, clearError } = useField(params.name);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);  

  return (
    <FormControl fullWidth={params.fullWidth || false } error={!!error}>
      <InputLabel id={`${params.name}-label`}>{params.label}</InputLabel>
      <Select
        {...params}
        labelId={`${params.name}-label`}
        value={value}
        onChange={(e) => {setValue(String(e.target?.value)); error && clearError();}}
        onKeyDown={(e) => {error && clearError(); params.onKeyDown?.(e); }}
      >
        <MenuItem value={''}><em>Não informado</em></MenuItem>
        {params.options.map(option => <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>)}
      </Select>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};