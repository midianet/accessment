import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

import { useDebounce } from '../../../shared/hooks';
import { useField } from '@unform/core';

type AutoCompleteOption = {
  id: number;
  label: string;
}

interface AutoCompleteProps {
  isExternalLoading?: boolean;
  name: string;
  label: string;
  load: () => AutoCompleteOption[];
}
export const AutoCompleteDisciplina: React.FC<AutoCompleteProps> = ({ isExternalLoading = false, name, label, load}) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);
  const { debounce } = useDebounce();
  const [selectedId, setSelectedId] = useState<number | undefined>(defaultValue);
  const [opcoes, setOpcoes] = useState<AutoCompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [first, setFirst] = useState(true);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedId,
      setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
    });
  }, [registerField, fieldName, selectedId]);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      /*load().
        .then((result) => {
          setFirst(false);
          setIsLoading(false);
          if (result instanceof Error) {
            // alert(result.message);
          } else {
            setOpcoes(result.data.map(disciplina => ({ id: disciplina.id, label: disciplina.nome})));
          }
        });*/
    });
  }, [busca, selectedId]);

  const autoCompleteSelectedOption = useMemo(() => {
    if (!selectedId) return null;
    const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
    if (!selectedOption) return null;
    return selectedOption;
  }, [selectedId, opcoes]);

  return (
    <Autocomplete
      openText='Abrir'
      closeText='Fechar'
      noOptionsText='Sem opções'
      loadingText='Carregando...'
      disablePortal
      options={opcoes}
      loading={isLoading}
      disabled={isExternalLoading}
      value={autoCompleteSelectedOption}
      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => { setSelectedId(newValue?.id); clearError(); }}
      popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28} /> : undefined}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};