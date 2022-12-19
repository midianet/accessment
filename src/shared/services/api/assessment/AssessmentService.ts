import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface AssessmentGrupo {
  id: number;
  nome: string;
  elementos: Assessment[];
}

export interface Assessment {
    id?:number;
    maturidade?:string;
    perguntaId: number;
    perguntaTexto: string;
    perguntaAjuda: string;
}

export interface AssessmentRadar {
  grupo:string;
  valor:number;
}

export interface AssessmentList  {
    data: AssessmentGrupo[];
}

const get = async (projeto:number, disciplina?:number): Promise<AssessmentList | Error> => {
  try {
    const { data } = await Api.get(`${Environment.ASSESSMENT_API}/${projeto}${disciplina ? `?disciplinaId=${disciplina}`: ''}`);
    if (data) {
      return { data : data.grupos};
    }
    return new Error(Environment.REGISTRO_LISTA_ERRO);
  } catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_LISTA_ERRO);
  }
};

const radar = async (projeto:number): Promise<AssessmentRadar[] | Error> => {
  try {
    const { data } = await Api.get(`${Environment.ASSESSMENT_API}/${projeto}/radar`);
    if (data) return data;
    return new Error(Environment.REGISTRO_LISTA_ERRO);
  } catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_LISTA_ERRO);
  }
};


const save = async (projetoId:number, assessment: Assessment): Promise<number | Error> => {
  try{
    const { data } = await Api.post<number>(`${Environment.RESPOSTA_API}/${projetoId}`, assessment);
    if (data)  return data;
    return new Error(Environment.REGISTRO_CRIAR_ERRO);
  }catch(error) {
    console.log(error);
    return new Error((error as {message: string}).message || Environment.REGISTRO_CRIAR_ERRO);
  }
};

export const AssessmentService = {
  get,
  radar,
  save
};