
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, CidadeLista , CidadeEditor , PessoaLista, PessoaEditor} from '../pages';
import { useDrawerContext } from '../shared/contexts';

export const AppRoutes = () =>  {

  const { setDrawerOptions } = useDrawerContext();
  
  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/pagina-inicial',
        label: 'Página Inicial'
      },
      {
        icon: 'people',
        path: '/pessoas',
        label: 'Pessoas'
      },
      {
        icon: 'location_city',
        path: '/cidades',
        label: 'Cidades'
      }
    ]);
  },[]); 

  return (<Routes>
    <Route path="/pagina-inicial" element={<Dashboard />}/>
    <Route path="/cidades" element={<CidadeLista />}/>
    <Route path="/cidades/detalhe/:id" element={<CidadeEditor />}/>
    <Route path="/pessoas" element={<PessoaLista/>}/>
    <Route path="/pessoas/detalhe/:id" element={<PessoaEditor />}/>
    <Route path="*" element={<Navigate to={'/pagina-inicial'} />} />
  </Routes>
  );
};