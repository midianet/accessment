import { Theme, Box, Button, Divider, Icon, Paper, Skeleton, Typography, useTheme, useMediaQuery } from '@mui/material';

interface IBarraAcoesEdicao{
    mostrarSalvar?: boolean;
    prontoSalvar?: boolean;
    eventoSalvar?: () => void;
    mostrarDeletar?: boolean;
    prontoDeletar?: boolean;
    eventoDeletar?: () => void;
    mostrarNovo?: boolean;
    rotuloNovo?: string;
    prontoNovo?: boolean;
    eventoNovo?: () => void;
    mostrarVoltar?: boolean;
    eventoVoltar?: () => void;
  }
export const BarraAcoesEdicao: React.FC<IBarraAcoesEdicao> = ({
  mostrarSalvar = false,
  prontoSalvar = false,
  eventoSalvar,
  mostrarDeletar = false,
  prontoDeletar =  false,
  eventoDeletar,
  mostrarNovo = false,
  rotuloNovo = '',
  prontoNovo = false,
  eventoNovo,
  mostrarVoltar = true,
  eventoVoltar
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));  
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));  
  const theme = useTheme();
  return (
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
      {(mostrarSalvar && prontoSalvar) && (
        <Button
          color="primary"
          disableElevation
          variant="contained"
          startIcon={<Icon>save</Icon>}
          onClick={eventoSalvar}
        >
          <Typography variant="button" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" >Salvar</Typography>
        </Button>
      )}
      {(mostrarSalvar && !prontoSalvar) && (
        <Skeleton width={110} height={60} />
      )}
      {(mostrarDeletar && prontoDeletar) && (
        <Button
          color="primary"
          disableElevation
          variant="outlined"
          startIcon={<Icon>delete</Icon>}
          onClick={eventoDeletar}
        >
          <Typography variant="button" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" >Deletar</Typography>    
        </Button>
      )}
      {(mostrarDeletar && !prontoDeletar)&&(
        <Skeleton width={110} height={60} />
      )}
      {(mostrarNovo && prontoNovo && !smDown && !mdDown) && (
        <Button
          color="primary"
          disableElevation
          variant="outlined"
          startIcon={<Icon>add</Icon>}
          onClick={eventoNovo}
        >
          <Typography variant="button" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" >{rotuloNovo}</Typography>
        </Button>
      )}
      {(mostrarNovo && !prontoNovo && !smDown && !mdDown)&& (
        <Skeleton width={110} height={60} />
      )}
      {(mostrarSalvar || mostrarDeletar || mostrarNovo || mostrarVoltar) && (
        <Divider variant="middle" orientation="vertical" />  
      )}      
      {mostrarVoltar && (
        <Button
          color="primary"
          disableElevation
          variant="outlined"
          startIcon={<Icon>arrow_back</Icon>}
          onClick={eventoVoltar}>
          <Typography variant="button" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" >Voltar</Typography>
        </Button>
      )}        
    </Box>
  );
};