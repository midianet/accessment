import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, FormControl, FormHelperText, Grid, InputLabel, LinearProgress, MenuItem, Paper, Select } from '@mui/material';

import { LayoutBase } from '../../shared/layouts';
import { useMessageContext, MessageType } from '../../shared/contexts';

import { Disciplina, DisciplinaService } from '../../shared/services/api/disciplina/DisciplinaService';
import { Projeto, ProjetoService } from '../../shared/services/api/projeto/ProjetoService';

export const AssessmentEditor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
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
    //setIsLoading(true);      
    /*PerguntaService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            showMessage({message: result.message, level: MessageType.Error});
            navigate(Environment.PERGUNTA_LISTA);
          } else {
            formRef.current?.setData(result);
          }
        });*/
  }, [disciplinaId,projetoId]);

  return (
    <LayoutBase titulo="Assessment">
      <Box margin={1} display="flex" flexDirection="column" component={Paper} variant = "outlined">
        <Grid container direction="column" padding={2} spacing={4} >
          {isLoading && (<Grid item>
            <LinearProgress variant="indeterminate"/>
          </Grid>
          )}
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
          <Grid container item direction="row" spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={8} xl={8}>
              {/*<VTextField
                fullWidth
                multiline={true}
                minRows={4}
                maxRows={4}
                label="Texto"
                disabled={isLoading}
                placeholder="Texto" 
          name="texto"/>*/}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBase>
  );

};