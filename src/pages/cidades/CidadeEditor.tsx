import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import  * as yup  from 'yup';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';

import { LayoutBase } from '../../shared/layouts';
import { BarraAcoesEdicao, DialogoConfirmacao } from '../../shared/components';
import { VForm, VTextField, useVForm, IVFormErrors } from '../../shared/forms';
import { CidadeService } from '../../shared/services/api/cidades/CidadeService';
import { useMessageContext } from '../../shared/contexts';

interface IFormData {
  nome: string;
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nome: yup.string().required().min(3), 
});

export const CidadeEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id = 'nova' } = useParams<'id'>();
  const [isLoading, setIsLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const { formRef, save } = useVForm();
  const {showMessage} = useMessageContext();
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  
  useEffect(() => {
    if(id !== 'nova') {
      setIsLoading(true);      
      CidadeService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            showMessage({message: result.message , level:'error'});
            navigate('/cidades');
          }else{
            setTitulo(result.nome);
            formRef.current?.setData(result);
          }
        });
    }else{
      formRef.current?.setData({
        nome: ''
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData ) => {
    formValidationSchema.
      validate(dados, { abortEarly:false })
      .then((dadosValidos) =>{
        setIsLoading(true);
        if(id === 'nova'){
          CidadeService.create(dadosValidos)
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message , level:'error'});
              }else{
                showMessage({message: 'Registro criado com sucesso'  , level:'success'});                
                navigate('/cidades');
              }
            });
        }else{
          CidadeService.updateById(Number(id), {id: Number(id), ...dadosValidos})
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message , level:'error'});
              }else{
                showMessage({message: 'Registro alterado com sucesso'  , level:'success'});                
                navigate('/cidades');
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
    CidadeService.deleteById(Number(id))
      .then(result => {
        if(result instanceof Error){
          showMessage({message: result.message , level:'error'});
        }else{
          showMessage({message:'Registro apagado com sucesso!', level:'success'});
          navigate('/cidades');
        }
      });
  };

  const handleDelete = () => {
    setIsOpenDelete(true);
  };
    
  return (
    <LayoutBase 
      titulo={id === 'nova' ? 'Nova Cidade' : titulo}
      toolbar={
        <BarraAcoesEdicao
          rotuloNovo='Nova'
          mostrarNovo={id !== 'nova'}
          mostrarDeletar={id !== 'nova'}
          mostrarSalvar
          prontoSalvar={!isLoading}
          prontoNovo={!isLoading}
          prontoDeletar={!isLoading}
          eventoNovo = {() => navigate('/cidades/detalhe/nova')}
          eventoVoltar = {() => navigate('/cidades')}
          eventoSalvar = {save}
          eventoDeletar = {() => handleDelete()}
        />
      }
    >
      <DialogoConfirmacao
        isOpen={isOpenDelete}
        text="Confirma Exclusão?"
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
            <Grid item>
              <Typography variant="h6">Geral</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <VTextField
                  fullWidth
                  label="Nome"
                  disabled={isLoading}
                  placeholder="Nome" 
                  onChange={e => setTitulo(e.target.value)}
                  name="nome"/>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm> 
    </LayoutBase>
  );

};