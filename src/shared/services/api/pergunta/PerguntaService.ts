import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface PerguntaList{
    id: number;
    disciplinaId: number;
    
}

export interface Pergunta{
    id: number;
    texto: string;
    ajuda?: string;
    disciplinaId: number;

}

type PerguntaListCount = {
    data: PerguntaList[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<PerguntaListCount | Error> => {
  try{
    const url = `${Environment.PERGUNTA_API}?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&id_like=${filter}`;
    console.log(url);
    const { data, headers } = await Api.get(url);
    if (data) {
      console.log(data);
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

const getById = async (id: number): Promise<Pergunta | Error> => {
  try{
    const { data } = await Api.get(`${Environment.PERGUNTA_API}/${id}`);
    if (data) {
      return data;
    }
    return new Error(Environment.REGISTRO_OBTER_ERRO);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_OBTER_ERRO);
  }
};

const create = async (dados: Omit<Pergunta,'id'>): Promise<number | Error> => {
  try{
    const { data } = await Api.post<Pergunta>(Environment.PERGUNTA_API, dados);
    if (data) {
      return data.id;
    }
    return new Error(Environment.REGISTRO_CRIAR_ERRO);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_CRIAR_ERRO);
  }   
};

const updateById = async (id: number, dados: Pergunta): Promise<void | Error> => {
  try{
    await Api.put<Pergunta>(`${Environment.PERGUNTA_API}/${id}`, dados);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_ALTERAR_ERRO);
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try{
    await Api.delete(`${Environment.PERGUNTA_API}/${id}`);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_ALTERAR_ERRO);
  }
};

export const PerguntaService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById
};