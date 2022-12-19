import { useEffect, useState } from 'react';

import { Box, FormControl, IconButton, Grid,  Typography, InputLabel, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, Accordion, AccordionSummary, Icon, AccordionDetails } from '@mui/material';

import ExpandMoreIcon   from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';

import { LayoutBase } from '../../shared/layouts';
import { useMessageContext, MessageType } from '../../shared/contexts';

import { Disciplina, DisciplinaService } from '../../shared/services/api/disciplina/DisciplinaService';
import { Projeto, ProjetoService } from '../../shared/services/api/projeto/ProjetoService';
import { AssessmentService, AssessmentGrupo, Assessment } from '../../shared/services/api/assessment/AssessmentService';
import InputAdornment from '@mui/material/InputAdornment';

export const AssessmentEditor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projetos, setProjetos] = useState<Projeto[]>();
  const [projetoId,setProjetoId] = useState<string>('');
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [disciplinaId,setDisciplinaId] = useState<string>('');
  const [rows, setRows] = useState<AssessmentGrupo[]>([]);    
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
    if(projetoId){
      setIsLoading(true);
      AssessmentService.get(Number(projetoId), disciplinaId ? Number(disciplinaId) : undefined)
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

  const saveMaturidade = (assessment: Assessment , maturidade: string) => {
    setIsLoading(true);
    assessment.maturidade = maturidade;
    AssessmentService.save(Number(projetoId), assessment)
      .then(result => {
        setIsLoading(false);
        if(result instanceof Error){
          showMessage({message: result.message, level: MessageType.Error});
        }else{
          assessment.id = result;
        }
      });
  };

  return (
    <LayoutBase titulo="Assessment">
      <Box margin={1} display="flex" flexDirection="column" component={Paper} variant = "outlined">
        <Grid container direction="column" padding={2} spacing={4} >
          <Grid container item direction="row" spacing={2}>
            <Grid item xs={6} sm={6} md={3} lg={4} xl={4}>
              <FormControl fullWidth>
                <InputLabel id="projeto-label">Projeto</InputLabel>
                <Select
                  id="projeto"
                  name="projeto"
                  label="Projeto"
                  labelId="projeto-label"
                  value={projetoId}
                  onChange={e => setProjetoId(e.target.value)}
                >
                  {projetos && projetos.map(projeto => <MenuItem value={String(projeto.id)} key={projeto.id}>{projeto.nome}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6} md={3} lg={4} xl={4}>
              <FormControl fullWidth>
                <InputLabel id="projeto-label">Disciplina</InputLabel>
                <Select
                  sx={{}}
                  id="disciplina"
                  name="disciplina"
                  label="Disciplina"
                  labelId="disciplina-label"
                  value={disciplinaId}
                  onChange={e => setDisciplinaId(e.target.value)}
                  endAdornment={
                    <InputAdornment position='start' >
                      <IconButton size='small' sx={{display: disciplinaId === ''  ? 'none': ''}} onClick={() => setDisciplinaId('')}>
                        <ClearIcon/>
                      </IconButton>
                    </InputAdornment>}
                >
                  {disciplinas.map(disciplina => <MenuItem value={String(disciplina.id)} key={disciplina.id}>{disciplina.nome}</MenuItem>)}
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
                                        value = {resposta.maturidade || ''}
                                        labelId={`${resposta.perguntaId}-label`}
                                        onChange={e => saveMaturidade( resposta, e.target.value )}
                                      >
                                        <MenuItem value={'ARRASTA'}><em>Arrasta</em></MenuItem>
                                        <MenuItem value={'ENGATINHA'}><em>Engatinha</em></MenuItem>
                                        <MenuItem value={'ANDA'}><em>Anda</em></MenuItem>
                                        <MenuItem value={'CORRE'}><em>Corre</em></MenuItem>
                                        <MenuItem value={'VOA'}><em>Voa</em></MenuItem>
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
                    <caption>Selecione um Projeto</caption>
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