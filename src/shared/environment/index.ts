export const Environment = {
  /**
   * Define a quantidade de linhas a ser carregada por padrão nas listagens. 
   */
  LIMITE_DE_LINHAS: 5,
  /**
   * Placeholder padrão dos campos de Pesquisa. 
   */
  INPUT_DE_BUSCA: 'Pesquisar...',
  /**
   * Texto padrão para lista quando vazia.
   */
  LISTAGEM_VAZIA: 'Nenhum registro encontrado!',

  REGISTRO_CRIADO: 'Registro criado com sucesso.',
  REGISTRO_ALTERADO: 'Registro alterado com sucesso.',
  REGISTRO_REMOVIDO: 'Registro removido com sucesso.',

  REGISTRO_REMOVER_PERGUNTA: 'Confirma Exclusão?',  

  REGISTRO_CRIAR_ERRO: 'Erro ao criar registro',
  REGISTRO_ALTERAR_ERRO: 'Erro ao alterar registro',
  REGISTRO_OBTER_ERRO: 'Erro ao obter registro',

  REGISTRO_LISTA_ERRO : 'Erro ao listar os registros',

  /**
   * Url base para chamadas de API.
   */
  URL_BASE: 'http://metarch-api.caravanasprati.org',

  DISCIPLINA_LISTA : '/disciplina',
  DISCIPLINA_EDITOR : '/disciplina/editor',
  DISCIPLINA_API: '/disciplinas',

  PERGUNTA_LISTA : '/pergunta',
  PERGUNTA_EDITOR : '/pergunta/editor',
  PERGUNTA_API: '/perguntas',

  PROJETO_LISTA : '/projeto',
  PROJETO_EDITOR : '/projeto/editor',
  PROJETO_API: '/projetos',

  ASSESSMENT_EDITOR: '/assessment/editor',
  ASSESSMENT_API: '/assessment',

  RESULTADO_DASHBOARD: '/resultado/dashboard',
  RESULTADO_DASHBOARD_API: '/resultado',

  RESPOSTA_API: '/resposta',
};