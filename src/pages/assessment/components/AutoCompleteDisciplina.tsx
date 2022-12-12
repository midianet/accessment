import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, AutocompleteProps, CircularProgress, TextField } from '@mui/material';

import { DisciplinaService } from '../../../shared/services/api/disciplina/DisciplinaService';
import { useDebounce } from '../../../shared/hooks';
import { useField } from '@unform/core';

type AutoCompleteOption = {
  id: number;
  label: string;
}

type AutoCompleteDisciplinaProps = {
  isExternalLoading?: boolean;
  disable?: boolean;
}
export const AutoCompleteDisciplina: React.FC<AutoCompleteDisciplinaProps> = ({ isExternalLoading = false }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField('disciplinasId');
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
      DisciplinaService.getAll(first ? -1 : 1, busca)
        .then((result) => {
          setFirst(false);
          setIsLoading(false);
          if (result instanceof Error) {
            // alert(result.message);
          } else {
            setOpcoes(result.data.map(disciplina => ({ id: disciplina.id, label: disciplina.nome})));
          }
        });
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
          label="Disciplina"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};