import { Environment } from '../../../environment';
import { Api } from '../axios-config';
import { UrlHelper } from '../axios-config/UrlHelper';

export interface Projeto{
    id: number;
    nome: string;
}

export interface ProjetoListCount {
    data: Projeto[];
    totalCount: number;
}

const getAll = async (page = 0, nome = '', order = ''): Promise<ProjetoListCount | Error> => {
  try{
    const params: string[] = [];
    if(page !== -1) params.push(`page=${page}`);
    if(nome) params.push(`nome=${nome}`);
    if(order) params.push(`order=${order}`);
    const { data } = await Api.get(UrlHelper.parseUrl( Environment.PROJETO_API, params));
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

const getById = async (id: number): Promise<Projeto | Error> => {
  try{
    const { data } = await Api.get(`${Environment.PROJETO_API}/${id}`);
    if (data) {
      return data;
    }
    return new Error(Environment.REGISTRO_OBTER_ERRO);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_OBTER_ERRO);
  }
};

const create = async (dados: Omit<Projeto,'id'>): Promise<number | Error> => {
  try{
    const { data } = await Api.post<Projeto>(Environment.PROJETO_API, dados);
    if (data) {
      return data.id;
    }
    return new Error(Environment.REGISTRO_CRIAR_ERRO);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_CRIAR_ERRO);
  }   
};

const updateById = async (id: number, dados: Projeto): Promise<void | Error> => {
  try{
    await Api.put<Projeto>(`${Environment.PROJETO_API}/${id}`, dados);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_ALTERAR_ERRO);
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try{
    await Api.delete(`${Environment.PROJETO_API}/${id}`);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_ALTERAR_ERRO);
  }
};

export const ProjetoService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById
};