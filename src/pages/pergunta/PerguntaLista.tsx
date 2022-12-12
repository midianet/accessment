import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';

import { BarraAcoesLista, DialogoConfirmacao } from '../../shared/components';
import { LayoutBase } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';
import { Environment } from '../../shared/environment'; 
import { useMessageContext, MessageType } from '../../shared/contexts';

import { Pergunta, PerguntaList, PerguntaService } from '../../shared/services/api/pergunta/PerguntaService';

export const PerguntaLista: React.FC = () => {
  
  const {showMessage} = useMessageContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce(1000);
  const navigate = useNavigate();

  const [rows, setRows] = useState<Pergunta[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>();

  const busca = useMemo(() => {
    return searchParams.get('texto') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina')) || 0;
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      PerguntaService.getAll(pagina, busca)
        .then((result) => {
          setIsLoading(false);
          if(result instanceof Error){
            showMessage({message: result.message, level: MessageType.Error});
          }else{
            setRows(result.data);
            setTotalCount(result.totalCount);
          }
        });
    });
  },[busca, pagina]);
  
  const onDelete = () => {
    setIsOpenDelete(false);
    if(selectedId){
      PerguntaService.deleteById(selectedId)
        .then(result => {
          if(result instanceof Error){
            showMessage({message: result.message, level: MessageType.Error});
          }else{
            setRows(oldRows => {
              return [ 
                ...oldRows.filter(oldRow => oldRow.id !== selectedId),
              ];
            });
            showMessage({message: Environment.REGISTRO_REMOVIDO, level: MessageType.Success});
          }
        });
    }
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setIsOpenDelete(true);
  };

  return (
    <LayoutBase titulo="Lista de Perguntas" toolbar= {
      <BarraAcoesLista
        mostrarPesquisa={true}
        mostrarNovo={true}
        rotuloNovo='Nova'
        eventoNovo={() => navigate(Environment.PERGUNTA_EDITOR)}
        textoPesquisa={busca}
        eventoPesquisa={texto => setSearchParams({busca:texto, pagina: '0'}, {replace: true})}
      />}
    >
      <DialogoConfirmacao
        isOpen={isOpenDelete}
        text={Environment.REGISTRO_REMOVER_PERGUNTA}
        handleYes={onDelete}
        handleNo={setIsOpenDelete}
      />
      <TableContainer component={Paper} variant="outlined" sx={{m: 1, width: 'auto'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{width: '70px'}}>Ações</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Disciplina</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <IconButton size="small" onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`${Environment.PERGUNTA_EDITOR}/${row.id}`)} >
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{`Pergunta ${row.id}`}</TableCell>
                <TableCell>{row.disciplina.nome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {totalCount === 0 && !isLoading &&(
            <caption>{Environment.LISTAGEM_VAZIA}</caption>
          )}
          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} >
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            )}
            {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS)  && (
              <TableRow>
                <TableCell colSpan={3} >
                  <Pagination 
                    count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)} 
                    page={pagina}
                    onChange={ (_, newPage) => setSearchParams({busca, pagina: newPage.toString()}, {replace: true})}/>
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBase>
  );
};