import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface DisciplinaList{
    id: number;
    nome: string;
}

export interface Disciplina{
    id: number;
    nome: string;
}

type DisciplinaListCount = {
    data: DisciplinaList[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<DisciplinaListCount | Error> => {
  try{
    const url = page === -1 ? Environment.DISCIPLINA_API : `${Environment.DISCIPLINA_API}?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
    const { data, headers } = await Api.get(url);
    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }
    return new Error(Environment.REGISTRO_LISTA_ERRO);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_LISTA_ERRO);
  }
};

const getById = async (id: number): Promise<Disciplina | Error> => {
  try{
    const { data } = await Api.get(`${Environment.DISCIPLINA_API}/${id}`);
    if (data) {
      return data;
    }
    return new Error(Environment.REGISTRO_OBTER_ERRO);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_OBTER_ERRO);
  }
};

const create = async (dados: Omit<Disciplina,'id'>): Promise<number | Error> => {
  try{
    const { data } = await Api.post<Disciplina>(Environment.DISCIPLINA_API, dados);
    if (data) {
      return data.id;
    }
    return new Error(Environment.REGISTRO_CRIAR_ERRO);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_CRIAR_ERRO);
  }   
};

const updateById = async (id: number, dados: Disciplina): Promise<void | Error> => {
  try{
    await Api.put<Disciplina>(`${Environment.DISCIPLINA_API}/${id}`, dados);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_ALTERAR_ERRO);
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try{
    await Api.delete(`${Environment.DISCIPLINA_API}/${id}`);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_ALTERAR_ERRO);
  }
};

export const DisciplinaService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById
};