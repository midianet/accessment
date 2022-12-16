import { useEffect, useState } from 'react';

import { Box, FormControl, FormHelperText, Grid,  Typography, InputLabel, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, Accordion, AccordionSummary, Icon, AccordionDetails } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { LayoutBase } from '../../shared/layouts';
import { useMessageContext, MessageType } from '../../shared/contexts';

import { Disciplina, DisciplinaService } from '../../shared/services/api/disciplina/DisciplinaService';
import { Projeto, ProjetoService } from '../../shared/services/api/projeto/ProjetoService';
import { AssessmentService, AssessmentGrupo } from '../../shared/services/api/assessment/AssessmentService';
import { Environment } from '../../shared/environment';

export const AssessmentEditor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [rows, setRows] = useState<AssessmentGrupo[]>([]);
  const [projetoId,setProjetoId] = useState<number>(-1);
  const [disciplinaId,setDisciplinaId] = useState<number>(-1);
  const { showMessage } = useMessageContext();
  
  useEffect(() => {
    setIsLoading(true);
    ProjetoService.getAll(-1)
      .then((result) => {
        if(result instanceof Error){
          setIsLoading(false);
          showMessage({message: result.message, level: MessageType.Error});
        }else{
          setProjetos(result.data);
          DisciplinaService.getAll(-1)
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message, level: MessageType.Error});
              }else{
                setDisciplinas(result.data);
              }
            });
        }
      });
  }, []);

  useEffect(() => {
    if(projetoId !== -1){
      setIsLoading(true);
      AssessmentService.get(projetoId,disciplinaId !== -1 ? disciplinaId : undefined)
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            showMessage({message: result.message, level: MessageType.Error});
          } else {
            setRows(result.data);
          }
        });
    }
  }, [disciplinaId,projetoId]);

  return (
    <LayoutBase titulo="Assessment">
      <Box margin={1} display="flex" flexDirection="column" component={Paper} variant = "outlined">
        <Grid container direction="column" padding={2} spacing={4} >
          <Grid container item direction="row" spacing={2}>
            <Grid item xs={6} sm={6} md={3} lg={4} xl={4}>
              <FormControl fullWidth error={projetoId === -1}>
                <InputLabel id="projeto-label">Projeto</InputLabel>
                <Select
                  id="projeto"
                  name="projeto"
                  label="Projeto"
                  labelId="projeto-label"
                  value={projetoId}
                  onChange={(e) => setProjetoId(Number(e.target.value))}
                >
                  <MenuItem value={-1}><em>Não informado</em></MenuItem>
                  {projetos.map(projeto => <MenuItem value={projeto.id} key={projeto.id}>{projeto.nome}</MenuItem>)}
                </Select>
                <FormHelperText>{projetoId === -1 ?  'Projeto Obrigatório':''}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6} md={3} lg={4} xl={4}>
              <FormControl fullWidth>
                <InputLabel id="projeto-label">Disciplina</InputLabel>
                <Select
                  id="disciplina"
                  name="disciplina"
                  label="Disciplina"
                  labelId="disciplina-label"
                  value={disciplinaId}
                  onChange={(e) => setDisciplinaId(Number(e.target.value))}
                >
                  <MenuItem value={-1}><em>Não informado</em></MenuItem>
                  {disciplinas.map(disciplina => <MenuItem value={disciplina.id} key={disciplina.id}>{disciplina.nome}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>  
          </Grid>
          <Grid container item direction="row" spacing={1}>
            <Grid item xs={12} sm={12} md={6} lg={8} xl={8}>
              {isLoading && (<Grid item>
                <LinearProgress variant="indeterminate"/>
              </Grid>
              )}              
              <TableContainer component={Paper} variant="outlined" sx={{m: 1, width: 'auto'}}>
                <Table>
                  {/*<TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>*/}
                  <TableBody>
                    {rows.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Accordion aria-expanded="true" elevation={1} >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls={`${row.id}-text}`}
                              id={`${row.id}-text}`}
                            >
                              <Typography style={{color: 'blueviolet'}}>{row.nome}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {row.elementos?.map(resposta => (  
                                <>
                                  <Accordion key={resposta.perguntaId} elevation={0}>
                                    <AccordionSummary
                                      expandIcon={<Icon>help</Icon>}
                                    >
                                      <Typography>{resposta.perguntaTexto}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Typography style={{color:'orange'}}>{resposta.perguntaAjuda}</Typography>
                                    </AccordionDetails>
                                  </Accordion>
                                  <Grid container xs={12} sm={12} md={8} lg={6} xl={6}>
                                    <FormControl fullWidth>
                                      <InputLabel id={`${resposta.perguntaId}-label`}>Maturidade</InputLabel>
                                      <Select
                                        size="medium"
                                        label="Maturidade"
                                        labelId={`${resposta.perguntaId}-label`}
                                      >
                                        <MenuItem value={-1}><em>Não informado</em></MenuItem>
                                        <MenuItem value={1}><em>Arrasta</em></MenuItem>
                                        <MenuItem value={1}><em>Engatinha</em></MenuItem>
                                        <MenuItem value={1}><em>Anda</em></MenuItem>
                                        <MenuItem value={1}><em>Corre</em></MenuItem>
                                        <MenuItem value={1}><em>Voa</em></MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid> 
                                </>))}
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {rows?.length === 0 && !isLoading &&(
                    <caption>{Environment.LISTAGEM_VAZIA}</caption>
                  )}
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBase>
  );

};