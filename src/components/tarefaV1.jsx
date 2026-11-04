const moverTarefa = async (id, novaColuna) => {
  try {
    // 1. Encontra a tarefa original na lista
    const tarefaAtual = tarefas.find((t) => t.id === id);
    if (!tarefaAtual) return;

    // 2. Extrai e sanitiza os IDs de chave estrangeira
    const prioId = Number(
      tarefaAtual.prioridade_id ?? 
      tarefaAtual.prioridadeId ?? 
      tarefaAtual.idprioridade ?? 
      tarefaAtual.prioridades?.id
    );

    const userPaiId = Number(
      tarefaAtual.usuario_id ?? 
      tarefaAtual.usuarioId ?? 
      tarefaAtual.idusuario ?? 
      tarefaAtual.usuarios?.id
    );

    const projId = Number(
      tarefaAtual.projeto_id ?? 
      tarefaAtual.projetoId ?? 
      tarefaAtual.projetos?.id
    );

    // 3. Monta o payload enviando APENAS IDs válidos (maiores que 0)
    const payload = {
      texto: tarefaAtual.texto || tarefaAtual.descricao,
      coluna: novaColuna,
      status: novaColuna,
      cidade: tarefaAtual.cidade || "",
      // Envia prioridade se for válida; caso contrário, envia 1 (baixa)
      prioridade_id: (!isNaN(prioId) && prioId > 0) ? prioId : 1,
      prioridadeId: (!isNaN(prioId) && prioId > 0) ? prioId : 1,
    };

    // Adiciona usuario_id apenas se for um número válido
    if (!isNaN(userPaiId) && userPaiId > 0) {
      payload.usuario_id = userPaiId;
      payload.usuarioId = userPaiId;
    }

    // Adiciona projeto_id apenas se for um número válido
    if (!isNaN(projId) && projId > 0) {
      payload.projeto_id = projId;
      payload.projetoId = projId;
    }

    // 4. Executa o PUT na API
    await api.put(`/tarefas/${id}`, payload);

    // 5. Atualiza o estado local para mover o cartão instantaneamente no ecrã
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, coluna: novaColuna } : t))
    );

  } catch (error) {
    console.error("Erro ao mover tarefa:", error.response?.data || error);
    alert(
      error.response?.data?.erro || 
      "Erro ao mover tarefa. Verifica os dados do utilizador/prioridade."
    );
  }
};