import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { BarraAcoesEdicao } from '../../shared/components';
import { LayoutBase } from '../../shared/layouts/LayoutBase';
import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';
import { CidadeService } from '../../shared/services/api/cidades/CidadeService';
import { useMessageContext } from '../../shared/contexts';

export const Dashboard = () => {
  const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
  const [isLoadingCidades, setIsLoadingCidades] = useState(true);
  const [totalPessoas, setTotalPessoas] = useState(0);
  const [totalCidades, setTotalCidades] = useState(0);
  const {showMessage} = useMessageContext();

  useEffect(() => {
    setIsLoadingPessoas(true);
    PessoasService.getAll(1)
      .then((result) => {
        setIsLoadingPessoas(false);
        if(result instanceof Error){
          showMessage({message: result.message , level:'error'});
        }else{
          setTotalPessoas(result.totalCount);
        }
      });
  },[]);

  useEffect(() => {
    setIsLoadingCidades(true);
    CidadeService.getAll(1)
      .then((result) => {
        setIsLoadingCidades(false);
        if(result instanceof Error){
          showMessage({message: result.message , level:'error'});
        }else{
          setTotalCidades(result.totalCount);
        }
      });
  },[]);

  return (
    <LayoutBase 
      titulo="Página Inicial" 
      toolbar={<BarraAcoesEdicao mostrarNovo = {false} mostrarVoltar = {false}/>} 
    >
      <Box width="100%" display="flex">
        <Grid container margin={1}>
          <Grid item container spacing={2}  display="flex" justifyContent="center">
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">Total de Pessoas</Typography>
                </CardContent>
                <Box padding={6} display="flex" justifyContent="center" alignItems="vertical">
                  {!isLoadingPessoas && (
                    <Typography variant="h1">
                      {totalPessoas}
                    </Typography>
                  )}
                  {isLoadingPessoas && (
                    <Typography 
                      variant="h6"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                    >
                      Carregando...
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">Total de Cidades</Typography>
                </CardContent>
                <Box padding={6} display="flex" justifyContent="center" alignItems="vertical">
                  {!isLoadingCidades && (
                    <Typography variant="h1">
                      {totalCidades}
                    </Typography>
                  )}
                  {isLoadingCidades && (
                    <Typography 
                      variant="h6"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                    >
                      Carregando...
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBase>
  );
};