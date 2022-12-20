import { Environment } from '../../../environment';
import { Api } from '../axios-config';
import { UrlHelper } from '../axios-config/UrlHelper';
import { Disciplina } from '../disciplina/DisciplinaService';

export interface Pergunta{
    id: number;
    texto: string;
    ajuda?: string;
    disciplina: Disciplina;
}

export interface PerguntaList  {
    data: Pergunta[];
    totalCount: number;
}

const getAll = async (page = 1, texto = '', order = ''): Promise<PerguntaList | Error> => {
  try{
    page = page -1;
    const params: string[] = [];
    if(page !== -2) params.push(`page=${page}`);
    if(texto) params.push(`texto=${texto}`);
    if(order) params.push(`order=${order}`);
    const { data } = await Api.get(UrlHelper.parseUrl( Environment.PERGUNTA_API, params));
    if (data) {
      return {
        data : data.content,
        totalCount: data.totalElements
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