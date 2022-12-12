import { useEffect, useState } from 'react';
import { Environment } from '../../shared/environment';
import { useNavigate, useParams } from 'react-router-dom';

import  * as yup  from 'yup';
import { Box, Grid, LinearProgress, Paper } from '@mui/material';

import { LayoutBase } from '../../shared/layouts';
import { BarraAcoesEdicao, DialogoConfirmacao } from '../../shared/components';
import { VForm, VTextField, useVForm, IVFormErrors } from '../../shared/forms';
import { useMessageContext, MessageType } from '../../shared/contexts';
import { ProjetoService } from '../../shared/services/api/projeto/ProjetoService';

interface Form {
  nome: string;
}
const validationSchema: yup.SchemaOf<Form> = yup.object().shape({
  nome: yup.string().required().min(3), 
});

export const ProjetoEditor: React.FC = () => {
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
        nome: ''
      });
    }else{
      setIsLoading(true);      
      ProjetoService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            showMessage({message: result.message, level: MessageType.Error});
            navigate(Environment.PROJETO_LISTA);
          }else{
            setTitle(result.nome);
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
          ProjetoService.create(dadosValidos)
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message, level: MessageType.Error});
              }else{
                showMessage({message: Environment.REGISTRO_CRIADO, level: MessageType.Success});
                navigate(Environment.PROJETO_LISTA);
              }
            });
        } else {
          ProjetoService.updateById(Number(id), {id: Number(id), ...dadosValidos})
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message, level: MessageType.Error});
              }else{
                showMessage({message: Environment.REGISTRO_ALTERADO, level: MessageType.Success});
                navigate(Environment.PROJETO_LISTA);
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

  const onDelete = () => {
    setIsOpenDelete(false);
    ProjetoService.deleteById(Number(id))
      .then(result => {
        if(result instanceof Error){
          showMessage({message: result.message, level: MessageType.Error});
        }else{
          showMessage({message: Environment.REGISTRO_REMOVIDO, level: MessageType.Success});
          navigate(Environment.PROJETO_LISTA);
        }
      });
  };

  const handleDelete = () => {
    setIsOpenDelete(true);
  };
    
  return (
    <LayoutBase 
      titulo={id ? title : 'Novo Projeto'}
      toolbar={
        <BarraAcoesEdicao
          rotuloNovo='Novo'
          mostrarNovo={!isNew}
          mostrarDeletar={!isNew}
          mostrarSalvar
          prontoSalvar={!isLoading}
          prontoNovo={!isLoading}
          prontoDeletar={!isLoading}
          eventoNovo = {() => navigate(Environment.PROJETO_EDITOR)}
          eventoVoltar = {() => navigate(Environment.PROJETO_LISTA)}
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
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <VTextField
                  fullWidth
                  label="Nome"
                  disabled={isLoading}
                  placeholder="Nome" 
                  onChange={e => setTitle(e.target.value)}
                  name="nome"/>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm> 
    </LayoutBase>
  );

};