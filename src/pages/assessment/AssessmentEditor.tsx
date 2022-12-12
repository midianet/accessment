import { useEffect, useState } from 'react';
import { Environment } from '../../shared/environment';
import { useNavigate, useParams } from 'react-router-dom';

import  * as yup  from 'yup';
import { Box, Grid, LinearProgress, Paper } from '@mui/material';

import { LayoutBase } from '../../shared/layouts';
import { VForm, VTextField, useVForm, IVFormErrors } from '../../shared/forms';
import { useMessageContext, MessageType } from '../../shared/contexts';

import { PerguntaService } from '../../shared/services/api/pergunta/PerguntaService';
import { AutoCompleteDisciplina } from './components/AutoCompleteDisciplina';
import { AutoCompleteProjeto } from './components/AutoCompleteProjeto';
/*
interface Form {
  texto: string;
  ajuda?: string;
  disciplinasId: number;
}

const validationSchema: yup.SchemaOf<Form> = yup.object().shape({
  texto: yup.string().required().min(3), 
  ajuda: yup.string().notRequired(),
  disciplinasId: yup.number().required()
});
*/
export const AssessmentEditor: React.FC = () => {
/*  const navigate = useNavigate();
  const { id = undefined } = useParams<'id'>();
  const isNew = id === undefined;
  const [isLoading, setIsLoading] = useState(false);
  const { formRef, save } = useVForm();
  const { showMessage } = useMessageContext();
  
  useEffect(() => {
    if(isNew) {
      formRef.current?.setData({
        texto: '',
        disciplinasId: undefined
      });
    } else {
      setIsLoading(true);      
      PerguntaService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            showMessage({message: result.message, level: MessageType.Error});
            navigate(Environment.PERGUNTA_LISTA);
          } else {
            formRef.current?.setData(result);
          }
        });
    }
  }, [id]);

  const handleSave = (dados: Form ) => {
    validationSchema.
      validate(dados, { abortEarly:false })
      .then((dadosValidos) =>{
        setIsLoading(true);
        if(isNew){
          PerguntaService.create(dadosValidos)
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message, level: MessageType.Error});
              }else{
                showMessage({message: Environment.REGISTRO_CRIADO, level: MessageType.Success});
                navigate(Environment.PERGUNTA_LISTA);
              }
            });
        } else {
          PerguntaService.updateById(Number(id), {id: Number(id), ...dadosValidos})
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message, level: MessageType.Error});
              }else{
                showMessage({message: Environment.REGISTRO_ALTERADO, level: MessageType.Success});
                navigate(Environment.PERGUNTA_LISTA);
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationsErrors: IVFormErrors = {};
        errors.inner.forEach(error => {
          if(!error.path) return;
          validationsErrors[error.path] = error.message;
        });
        formRef.current?.setErrors(validationsErrors);
      });
  };
    */
  return (
    <LayoutBase titulo="Assessment">
      {/*
      <VForm ref={formRef}  onSubmit={handleSave} >
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant = "outlined">
          <Grid container direction="column" padding={2} spacing={4} >
            {isLoading && (<Grid item>
              <LinearProgress variant="indeterminate"/>
            </Grid>
            )}
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={6} sm={6} md={3} lg={4} xl={4}>
                <AutoCompleteProjeto
                  isExternalLoading={isLoading}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={3} lg={4} xl={4}>
                <AutoCompleteDisciplina 
                  disable = {false}
                  isExternalLoading={isLoading}
                />
              </Grid>  
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={8} xl={8}>
                <VTextField
                  fullWidth
                  multiline={true}
                  minRows={4}
                  maxRows={4}
                  label="Texto"
                  disabled={isLoading}
                  placeholder="Texto" 
                  name="texto"/>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={8} xl={8}>
                <VTextField
                  fullWidth
                  multiline={true}
                  minRows={4}
                  maxRows={4}                  
                  label="Ajuda"
                  disabled={isLoading} 
                  placeholder="Ajuda" 
                  name="ajuda"
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
            </VForm> */}
    </LayoutBase>
  );

};