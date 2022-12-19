import { useEffect, useState, useRef } from 'react';

import { Box, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Paper, Select } from '@mui/material';

import { LayoutBase } from '../../shared/layouts';
import { useMessageContext, MessageType } from '../../shared/contexts';

import { Projeto, ProjetoService } from '../../shared/services/api/projeto/ProjetoService';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ChartData } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { AssessmentService } from '../../shared/services/api/assessment/AssessmentService';
import Typography from '@mui/material/Typography';

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
  const [projetos, setProjetos] = useState<Projeto[]>();
  const [projetoId,setProjetoId] = useState<string>('');
  const [data, setData] = useState<ChartData>();
  const chartRef = useRef<ChartJS>();
  const { showMessage } = useMessageContext();
  
  useEffect(() => {
    setIsLoading(true);
    ProjetoService.getAll(-1)
      .then((result) => {
        setIsLoading(false);        
        if(result instanceof Error){
          showMessage({message: result.message, level: MessageType.Error});
        }else{
          setProjetos(result.data);
        }
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if(projetoId){
      AssessmentService.radar( Number(projetoId) )
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            showMessage({message: result.message, level: MessageType.Error});
          } else {
            const chart = chartRef.current;
            if(chart){
              ChartJS.defaults.backgroundColor = '#9BD0F5';
              ChartJS.defaults.borderColor = '#36A2EB';
            }
            const newData = {
              labels: result.map(g => g.grupo),
              datasets: [
                {
                  label: 'Assesment Transformação Digital',
                  backgroundColor: 'rgba(75, 0, 130, 1)',
                  borderColor: 'rgba(255,255,255,1)',
                  color:'rgba(200,100,200,1)',
                  borderWidth: 2,
                  fill:true,
                  data: result.map(e => e.valor)
                },
              ]
            };
            setData(newData);
          }
        });
    }
  }, [projetoId]);

  return (
    <LayoutBase titulo="Resultado">
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
          </Grid>
          <Grid container item direction="row" spacing={1}>
            <Grid item xs={12} sm={12} md={6} lg={8} xl={8}>
              {isLoading && (<Grid item>
                <LinearProgress variant="indeterminate"/>
              </Grid>
              )}
              <Grid item xs={12} sm={12} md={6} lg={8} xl={8}>
                {data && <Chart ref={chartRef} type="radar" data={data}/>}
                {!data && <Typography>Selecione um Projeto</Typography>}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBase>
  );
};