import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { BarraAcoesEdicao } from '../../shared/components';
import { LayoutBase } from '../../shared/layouts/LayoutBase';
import { PerguntaService } from '../../shared/services/api/pergunta/PerguntaService';
import { DisciplinaService } from '../../shared/services/api/disciplina/DisciplinaService';
import { useMessageContext } from '../../shared/contexts';

export const Dashboard = () => {
  const [isLoadingPerguntas, setIsLoadingPerguntas] = useState(true);
  const [isLoadingDisciplinas, setIsLoadingDisciplinas] = useState(true);
  const [totalPerguntas, setTotalPerguntas] = useState(0);
  const [totalDisciplinas, setTotalDisciplinas] = useState(0);
  const {showMessage} = useMessageContext();

  useEffect(() => {
    setIsLoadingPerguntas(true);
    PerguntaService.getAll(1)
      .then((result) => {
        setIsLoadingPerguntas(false);
        if(result instanceof Error){
          showMessage({message: result.message , level:'error'});
        }else{
          setTotalPerguntas(result.totalCount);
        }
      });
  },[]);

  useEffect(() => {
    setIsLoadingDisciplinas(true);
    DisciplinaService.getAll(1)
      .then((result) => {
        setIsLoadingDisciplinas(false);
        if(result instanceof Error){
          showMessage({message: result.message , level:'error'});
        }else{
          setTotalDisciplinas(result.totalCount);
        }
      });
  },[]);

  return (
    <LayoutBase 
      titulo="" 
    >
      <Box width="100%" display="flex">
        <Grid container margin={1}>
          <Grid item container spacing={2}  display="flex" justifyContent="center">
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">Total de Perguntas</Typography>
                </CardContent>
                <Box padding={6} display="flex" justifyContent="center" alignItems="vertical">
                  {!isLoadingPerguntas && (
                    <Typography variant="h1">
                      {totalPerguntas}
                    </Typography>
                  )}
                  {isLoadingPerguntas && (
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
                  <Typography variant="h5" align="center">Total de Disciplinas</Typography>
                </CardContent>
                <Box padding={6} display="flex" justifyContent="center" alignItems="vertical">
                  {!isLoadingDisciplinas && (
                    <Typography variant="h1">
                      {totalDisciplinas}
                    </Typography>
                  )}
                  {isLoadingDisciplinas && (
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