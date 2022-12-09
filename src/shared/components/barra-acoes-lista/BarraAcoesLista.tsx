import { Box, Button, Icon, InputAdornment, Paper, TextField, useTheme } from '@mui/material';
import { Environment } from '../../environment';

interface IBarraAcoesLista{
  textoPesquisa?: string;
  mostrarPesquisa?: boolean;
  rotuloNovo?: string;
  mostrarNovo?: boolean;
  eventoPesquisa?: (novoTexto: string) => void;
  eventoNovo?: () => void;
}
export const BarraAcoesLista: React.FC<IBarraAcoesLista> = ({
  textoPesquisa = '',
  mostrarPesquisa = false,
  rotuloNovo,
  mostrarNovo,
  eventoPesquisa,
  eventoNovo
}) => {
  const theme = useTheme();
  return(
    <Box 
      gap={1}
      marginX={1} 
      padding={1}
      paddingX={2}  
      display="flex"
      alignItems="center"
      height={theme.spacing(5)}
      component={Paper}
    >
      {(mostrarPesquisa &&
        <TextField 
          size="small"
          value={textoPesquisa}
          onChange={(e) => eventoPesquisa?.(e.target.value)}
          placeholder={Environment.INPUT_DE_BUSCA}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end' >
                <Icon>search</Icon>
              </InputAdornment>
            )
          }}
        />
      )}
      <Box flex={1} display="flex" justifyContent="end">
        {mostrarNovo && (
          <Button
            color="primary"
            disableElevation
            variant="contained"
            startIcon={<Icon>add</Icon>}
            onClick={eventoNovo}
          >{rotuloNovo}</Button>
        )}
      </Box>
    </Box>
  );
}; 