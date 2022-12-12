
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, DisciplinaLista , DisciplinaEditor , PerguntaLista, PerguntaEditor, ProjetoLista, ProjetoEditor, AssessmentEditor } from '../pages';
import { useDrawerContext } from '../shared/contexts';
import { Environment } from '../shared/environment'; 

export const AppRoutes = () =>  {

  const { setDrawerOptions } = useDrawerContext();
  
  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/home',
        label: 'Página Inicial'
      },
      {
        icon: 'bookmark',
        path: Environment.DISCIPLINA_LISTA,
        label: 'Disciplinas'
      },
      {
        icon: 'live_help',
        path: Environment.PERGUNTA_LISTA,
        label: 'Perguntas'
      },
      {
        icon: 'account_tree',
        path: Environment.PROJETO_LISTA,
        label: 'Projetos'
      },
      {
        icon: 'format_list_bulleted',
        path: Environment.ASSESSMENT_EDITOR,
        label: 'Assessment'
      }
    ]);
  },[]); 

  return (<Routes>
    <Route path="/home" element={<Dashboard />}/>
    <Route path={Environment.DISCIPLINA_LISTA} element={<DisciplinaLista />}/>
    <Route path={Environment.DISCIPLINA_EDITOR} element={<DisciplinaEditor />}/>
    <Route path={`${Environment.DISCIPLINA_EDITOR}/:id`} element={<DisciplinaEditor />}/>
    <Route path={Environment.PERGUNTA_LISTA} element={<PerguntaLista/>}/>
    <Route path={Environment.PERGUNTA_EDITOR} element={<PerguntaEditor />}/>
    <Route path={`${Environment.PERGUNTA_EDITOR}/:id`} element={<PerguntaEditor />}/>
    <Route path={Environment.PROJETO_LISTA} element={<ProjetoLista/>}/>
    <Route path={Environment.PROJETO_EDITOR} element={<ProjetoEditor />}/>
    <Route path={Environment.ASSESSMENT_EDITOR} element={<AssessmentEditor />}/>
    <Route path="*" element={<Navigate to={'/home'} />} />
  </Routes>
  );
};