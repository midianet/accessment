import { Environment } from '../../../environment';
import { Api } from '../axios-config';
import { Disciplina } from '../disciplina/DisciplinaService';

export interface PerguntaList{
    id: number;
    disciplinasId: number;
    disciplinas: Disciplina;
}

export interface Pergunta{
    id: number;
    texto: string;
    ajuda?: string;
    disciplinasId: number;
}

type PerguntaListCount = {
    data: PerguntaList[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<PerguntaListCount | Error> => {
  try{
    const url = `${Environment.PERGUNTA_API}?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&id_like=${filter}`;
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

const getAllWithDisciplina = async (page = 1, filter = ''): Promise<PerguntaListCount | Error> => {
  try{
    const url = `${Environment.PERGUNTA_API}?_expand=disciplinas&_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&id_like=${filter}`;
    const { data, headers } = await Api.get(url);
    if (data) {
      console.log(data);
      //data.forEach((element: PerguntaList ) => DisciplinaService.getById(element.disciplinasId)
      //  .then((result) => element.disciplinaNome = (result as {nome: string}).nome));
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
  getAllWithDisciplina,
  create,
  getById,
  updateById,
  deleteById
};