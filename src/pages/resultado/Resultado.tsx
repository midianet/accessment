import { useEffect, useState, useRef } from 'react';

import { Box, FormControl, FormHelperText, Grid, InputLabel, LinearProgress, MenuItem, Paper, Select } from '@mui/material';

import { LayoutBase } from '../../shared/layouts';
import { useMessageContext, MessageType } from '../../shared/contexts';

import { Projeto, ProjetoService } from '../../shared/services/api/projeto/ProjetoService';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Colors } from 'chart.js';
import { Chart, Radar } from 'react-chartjs-2';
import { DisciplinaService } from '../../shared/services/api/disciplina/DisciplinaService';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);
 
export const Resultado: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [disciplinas, setDisciplinas] = useState<string[]>([]);
  //const [rows, setRows] = useState<AssessmentGrupo[]>([]);
  const [projetoId,setProjetoId] = useState<number>(-1);
  const { showMessage } = useMessageContext();
  const chartRef = useRef<ChartJS>(null);

  const data = {
    labels: disciplinas,
    datasets: [
      {
        label: 'Assesment Transformação Digital',
        backgroundColor: 'rgba(75, 0, 130, 1)',
        borderColor: 'rgba(255,255,255,1)',
        color:'rgba(200,100,200,1)',
        borderWidth: 2,
        fill:true,
        data: [6, 5, 5, 7, 6, 4, 8]
      },
    ],
    options: {
      plugins: {  // 'legend' now within object 'plugins {}'
        legend: {
          labels: {
            color: 'violet',  // not 'fontColor:' anymore
            // fontSize: 18  // not 'fontSize:' anymore
            font: {
              size: 18 // 'size' now within object 'font {}'
            }
          }
        },
      }
    }
  };

  useEffect(() => {
    const chart = chartRef.current;
    if(chart){
      ChartJS.defaults.backgroundColor = '#9BD0F5';
      ChartJS.defaults.borderColor = '#36A2EB';
    }
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
                setDisciplinas(result?.data.map(d => d.nome));
              }
            });
        }
      });
  }, []);

  /*useEffect(() => {
    if(projetoId !== -1){
      setIsLoading(true);
      AssessmentService.get(projetoId)
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            showMessage({message: result.message, level: MessageType.Error});
          } else {
            setRows(result.data);
          }
        });
    }
  }, [projetoId]);*/

  return (
    <LayoutBase titulo="Resultado">
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
          </Grid>
          <Grid container item direction="row" spacing={1}>
            <Grid item xs={12} sm={12} md={6} lg={8} xl={8}>
              {isLoading && (<Grid item>
                <LinearProgress variant="indeterminate"/>
              </Grid>
              )}
              <Grid item xs={12} sm={12} md={6} lg={8} xl={8}>
                <Chart ref={chartRef} type="radar" data={data}/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBase>
  );
};