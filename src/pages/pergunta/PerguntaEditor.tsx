import { useEffect, useState } from 'react';
import { Environment } from '../../shared/environment';
import { useNavigate, useParams } from 'react-router-dom';

import  * as yup  from 'yup';
import { Box, Grid, LinearProgress, MenuItem, Paper, Select } from '@mui/material';

import { LayoutBase } from '../../shared/layouts';
import { BarraAcoesEdicao, DialogoConfirmacao } from '../../shared/components';
import { VForm, VTextField, useVForm, IVFormErrors, VSelectField } from '../../shared/forms';
import { useMessageContext, MessageType } from '../../shared/contexts';

import { PerguntaService } from '../../shared/services/api/pergunta/PerguntaService';
import { AutoCompleteDisciplina } from './components/VAutoComplete';

interface Form {
  texto: string;
  ajuda?: string;
  disciplinaId: number;
}

const validationSchema: yup.SchemaOf<Form> = yup.object().shape({
  texto: yup.string().required().min(3), 
  ajuda: yup.string().notRequired(),
  disciplinaId: yup.number().required()
});

export const PerguntaEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id = undefined } = useParams<'id'>();
  const isNew = id === undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [title, setTitle] = useState('');
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
            setTitle(`Pergunta ${id}`);
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
          /*PerguntaService.create({...dadosValidos, disciplina: {id: dadosValidos.disciplinaId}})
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message, level: MessageType.Error});
              }else{
                showMessage({message: Environment.REGISTRO_CRIADO, level: MessageType.Success});
                navigate(Environment.PERGUNTA_LISTA);
              }
            });*/
        } else {
          /*PerguntaService.updateById(Number(id), {id: Number(id), ...dadosValidos})
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message, level: MessageType.Error});
              }else{
                showMessage({message: Environment.REGISTRO_ALTERADO, level: MessageType.Success});
                navigate(Environment.PERGUNTA_LISTA);
              }
            });*/
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

  const onDelete = () => {
    setIsOpenDelete(false);
    PerguntaService.deleteById(Number(id))
      .then(result => {
        if(result instanceof Error){
          showMessage({message: result.message, level: MessageType.Error});
        }else{
          showMessage({message: Environment.REGISTRO_REMOVIDO, level: MessageType.Success});
          navigate(Environment.PERGUNTA_LISTA);
        }
      });
  };

  const handleDelete = () => {
    setIsOpenDelete(true);
  };

  return (
    <LayoutBase 
      titulo={id ? title : 'Nova Pergunta'}
      toolbar={
        <BarraAcoesEdicao
          rotuloNovo='Nova'
          mostrarNovo={!isNew}
          mostrarDeletar={!isNew}
          mostrarSalvar
          prontoSalvar={!isLoading}
          prontoNovo={!isLoading}
          prontoDeletar={!isLoading}
          eventoNovo = {() => navigate(Environment.PERGUNTA_EDITOR)}
          eventoVoltar = {() => navigate(Environment.PERGUNTA_LISTA)}
          eventoSalvar = {save}
          eventoDeletar = {() => handleDelete()}
        />
      }
    >
      <DialogoConfirmacao
        isOpen={isOpenDelete}
        text={Environment.REGISTRO_REMOVER_PERGUNTA}
        handleYes={onDelete}
        handleNo={setIsOpenDelete}
      />
      <VForm ref={formRef}  onSubmit={handleSave} >
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant = "outlined">
          <Grid container direction="column" padding={2} spacing={4} >
            {isLoading && (<Grid item>
              <LinearProgress variant="indeterminate"/>
            </Grid>
            )}
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
                  onChange={e => setTitle(e.target.value)}
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
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <VSelectField
                  fullWidth
                  name="disciplina"
                  label="Disciplina"
                  placeholder="Disciplina" 
                  options={[{id:'1', label:'nome'},{id:'2', label:'telefone'}]}
                />
              </Grid> 
            </Grid>
          </Grid>
        </Box>
      </VForm> 
    </LayoutBase>
  );

};