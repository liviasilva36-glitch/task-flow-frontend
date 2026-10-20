import api from "./api";

export const tarefaService = {
  // GET /tarefas (Listar todas as tarefas do utilizador)
  async listar() {
    const response = await api.get("/tarefas");
    return response.data;
  },

  // POST /tarefas (Criar nova tarefa)
  async criar(dados) {
    const response = await api.post("/tarefas", dados);
    return response.data;
  },

  // PUT /tarefas/:id (Atualizar coluna, prioridade ou texto)
  async atualizar(id, dados) {
    const response = await api.put(`/tarefas/${id}`, dados);
    return response.data;
  },

  // DELETE /tarefas/:id (Remover tarefa)
  async remover(id) {
    const response = await api.delete(`/tarefas/${id}`);
    return response.data;
  },
};