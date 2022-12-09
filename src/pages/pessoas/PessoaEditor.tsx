import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarraAcoesEdicao, DialogoConfirmacao } from '../../shared/components';
import { VForm, VTextField, useVForm, IVFormErrors } from '../../shared/forms';
import { LayoutBase } from '../../shared/layouts';
import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';
import  * as yup  from 'yup';
import { AutoCompleteCidade } from './components/AutoCompleteCidade';
import { useMessageContext } from '../../shared/contexts';

interface IFormData {
  email: string;
  cidadeId: number;
  nome: string;
}
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nome: yup.string().required().min(3), 
  email: yup.string().required().email(),
  cidadeId: yup.number().required()
});

export const PessoaEditor: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const { formRef, save } = useVForm();
  const {showMessage} = useMessageContext();
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  
  useEffect(() => {
    if(id !== 'nova') {
      setIsLoading(true);      
      PessoasService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            showMessage({message: result.message , level:'error'});
            navigate('/pessoas');
          }else{
            setTitulo(result.nome);
            formRef.current?.setData(result);
          }
        });
    }else{
      formRef.current?.setData({
        nome: '',
        email:'',
        cidadeId: undefined
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData ) => {
    formValidationSchema.
      validate(dados, { abortEarly:false })
      .then((dadosValidos) =>{
        setIsLoading(true);
        if(id === 'nova'){
          PessoasService.create(dadosValidos)
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message , level:'error'});
              }else{
                showMessage({message: 'Registro criado com sucesso'  , level:'success'});
                navigate('/pessoas');
              }
            });
        }else{
          PessoasService.updateById(Number(id), {id: Number(id), ...dadosValidos})
            .then((result) => {
              setIsLoading(false);
              if(result instanceof Error){
                showMessage({message: result.message , level:'error'});
              }else{
                showMessage({message: 'Registro alterado com sucesso'  , level:'success'});
                navigate('/pessoas');
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
    PessoasService.deleteById(Number(id))
      .then(result => {
        if(result instanceof Error){
          showMessage({message: result.message , level:'error'});
        }else{
          showMessage({message:'Registro apagado com sucesso!', level:'success'});
          navigate('/pessoas');
        }
      });
  };

  const handleDelete = () => {
    setIsOpenDelete(true);
  };
    
  return (
    <LayoutBase 
      titulo={id === 'nova' ? 'Nova Pessoa' : titulo}
      toolbar={
        <BarraAcoesEdicao
          rotuloNovo='Nova'
          mostrarNovo={id !== 'nova'}
          mostrarDeletar={id !== 'nova'}
          mostrarSalvar
          prontoSalvar={!isLoading}
          prontoNovo={!isLoading}
          prontoDeletar={!isLoading}
          eventoNovo = {() => navigate('/pessoas/detalhe/nova')}
          eventoVoltar = {() => navigate('/pessoas')}
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
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <VTextField
                  fullWidth
                  label="E-mail"
                  disabled={isLoading} 
                  placeholder="Email" 
                  name="email"
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <AutoCompleteCidade
                  isExternalLoading={isLoading}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm> 
    </LayoutBase>
  );

};