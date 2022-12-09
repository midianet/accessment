import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemCidade{
    id: number;
    nome: string;
}

export interface IDetalheCidade{
    id: number;
    nome: string;
}

type TCidadesComTotalCount = {
    data: IListagemCidade[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TCidadesComTotalCount | Error> => {
  try{
    const url = `/cidades?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
    const { data, headers } = await Api.get(url);
    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }
    return new Error('Erro ao listar os registros');
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao listar os registros');
  }
};

const getById = async (id: number): Promise<IDetalheCidade | Error> => {
  try{
    const { data } = await Api.get(`/cidades/${id}`);
    if (data) {
      return data;
    }
    return new Error('Erro ao obter registro');
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao obter registro');
  }
};

const create = async (dados: Omit<IDetalheCidade,'id'>): Promise<number | Error> => {
  try{
    const { data } = await Api.post<IDetalheCidade>('/cidades', dados);
    if (data) {
      return data.id;
    }
    return new Error('Erro ao criar registro');
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao criar registro');
  }   
};

const updateById = async (id: number, dados: IDetalheCidade): Promise<void | Error> => {
  try{
    await Api.put<IDetalheCidade>(`/cidades/${id}`, dados);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao alterar registro');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try{
    await Api.delete(`/cidades/${id}`);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao deletar registro');
  }
};

export const CidadeService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById
};