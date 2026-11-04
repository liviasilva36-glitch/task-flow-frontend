import api from '../pages/api'; // ou o caminho da tua instância do axios

export const atualizarTarefa = async (id, dados) => {
  // Limpeza de IDs antes do envio
  const payload = {
    coluna: dados.coluna,
    status: dados.status || dados.coluna,
  };

  if (dados.texto) payload.texto = dados.texto;
  if (dados.cidade) payload.cidade = dados.cidade;

  // Garante que só envia prioridade se for um número válido > 0
  const prioId = Number(dados.prioridadeId || dados.prioridade_id);
  if (!isNaN(prioId) && prioId > 0) {
    payload.prioridadeId = prioId;
    payload.prioridade_id = prioId;
  }

  // Garante que só envia utilizador se for um número válido > 0
  const userId = Number(dados.usuarioId || dados.usuario_id);
  if (!isNaN(userId) && userId > 0) {
    payload.usuarioId = userId;
    payload.usuario_id = userId;
  }

  // Garante que só envia projeto se for um número válido > 0
  const projId = Number(dados.projetoId || dados.projeto_id);
  if (!isNaN(projId) && projId > 0) {
    payload.projetoId = projId;
    payload.projeto_id = projId;
  }

  const resposta = await api.put(`/tarefas/${id}`, payload);
  return resposta.data;
};