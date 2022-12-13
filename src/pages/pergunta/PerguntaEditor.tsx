import { useEffect, useState } from 'react';
import { Environment } from '../../shared/environment';
import { useNavigate, useParams } from 'react-router-dom';

import  * as yup  from 'yup';
import { Box, Grid, LinearProgress, Paper } from '@mui/material';

import { LayoutBase } from '../../shared/layouts';
import { BarraAcoesEdicao, DialogoConfirmacao } from '../../shared/components';
import { VForm, VTextField, useVForm, IVFormErrors, VSelectField, VSelectOption } from '../../shared/forms';
import { useMessageContext, MessageType } from '../../shared/contexts';

import { PerguntaService } from '../../shared/services/api/pergunta/PerguntaService';
import { DisciplinaService } from '../../shared/services/api/disciplina/DisciplinaService';

interface Form {
  texto: string;
  ajuda?: string;
  disciplinaId: string;
}

const validationSchema: yup.SchemaOf<Form> = yup.object().shape({
  texto: yup.string().required().min(3), 
  ajuda: yup.string().notRequired(),
  disciplinaId: yup.string().required()
});

export const PerguntaEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id = undefined } = useParams<'id'>();
  const isNew = id === undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [disciplinas, setDisciplinas] = useState<VSelectOption[]>([]);
  const [title, setTitle] = useState('');
  const { formRef, save } = useVForm();
  const { showMessage } = useMessageContext();

  useEffect(() => {
    DisciplinaService.getAll(-1)
      .then((result) => {
        if(result instanceof Error){
          showMessage({message: result.message, level: MessageType.Error});
        }else{
          setDisciplinas(result.data.map((element) =>{ return {value: String(element.id), label: element.nome};}));
        }
      });
  }, []);

  useEffect(() => {
    if(isNew) {
      formRef.current?.setData({
        texto: '',
        disciplinaId: ''
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
            formRef.current?.setData({disciplinaId: String(result.disciplina.id) , ...result});
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
          PerguntaService.create({...dadosValidos, disciplina: {id: Number(dadosValidos.disciplinaId), nome:''}})
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
          PerguntaService.updateById(Number(id), {id: Number(id), ...dadosValidos, disciplina: {id: Number(dadosValidos.disciplinaId), nome:''}})
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
                <VSelectField fullWidth name="disciplinaId" label="Disciplina"  options={disciplinas} />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm> 
    </LayoutBase>
  );

};