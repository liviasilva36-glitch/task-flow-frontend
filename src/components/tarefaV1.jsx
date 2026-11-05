
const moverTarefa = async (id, novaColuna) => {
  try {
    // 1. Encontra a tarefa na lista
    const tarefaAtual = tarefas.find(
      (t) => String(t.id) === String(id)
    );

    if (!tarefaAtual) {
      alert("Tarefa não encontrada!");
      return;
    }

    // 2. Verifica se a nova coluna é válida
    const colunasValidas = [
      "afazer",
      "andamento",
      "concluido"
    ];

    if (!colunasValidas.includes(novaColuna)) {
      alert("Coluna inválida!");
      return;
    }

    // 3. Envia somente a nova coluna para o Back-end
    const payload = {
      coluna: novaColuna
    };

    // 4. Atualiza no banco de dados
    await api.put(`/tarefas/${id}`, payload);

    // 5. Atualiza o Kanban na tela
    setTarefas((prev) =>
      prev.map((t) =>
        String(t.id) === String(id)
          ? {
              ...t,
              coluna: novaColuna,
              status: novaColuna
            }
          : t
      )
    );

    console.log("Tarefa movida com sucesso!");

  } catch (error) {
    console.error(
      "Erro ao mover tarefa:",
      error.response?.data || error
    );

    alert(
      error.response?.data?.erro ||
      "Não foi possível mover a tarefa. Tente novamente."
    );
  }
};
