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

const getAll = async (page = 0, texto = '', order = ''): Promise<PerguntaList | Error> => {
  try{
    const params: string[] = [];
    if(page !== -1) params.push(`page=${page}`);
    if(texto) params.push(`texto=${texto}`);
    if(order) params.push(`order=${order}`);
    const { data } = await Api.get(UrlHelper.parseUrl( Environment.PERGUNTA_API, params));
    console.log(data);
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

const getAllWithDisciplina = async (page = 0, filter = ''): Promise<PerguntaList | Error> => {
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