import React, { useState, useEffect } from "react";
import TarefaItem from "./TarefaItem";

export function TarefaV1() {
  // 1. Carrega as tarefas do localStorage
  const [tarefas, setTarefas] = useState(() => {
    const salvas = localStorage.getItem("@taskflow:tarefas");
    if (salvas) {
      try {
        return JSON.parse(salvas);
      } catch (e) {
        console.error("Erro ao carregar do localStorage", e);
      }
    }
    return [
      { id: 1, texto: "Estudar React", status: "afazer", coluna: "afazer", prioridade: "alta", cidade: "São Paulo" },
      { id: 2, texto: "Criar componente Kanban", status: "andamento", coluna: "andamento", prioridade: "media", cidade: "Rio de Janeiro" },
      { id: 3, texto: "Configurar Rotas", status: "concluido", coluna: "concluido", prioridade: "baixa", cidade: "Curitiba" }
    ];
  });

  // Estados do formulário
  const [novoTexto, setNovoTexto] = useState("");
  const [novaCidade, setNovaCidade] = useState("");
  const [novaPrioridade, setNovaPrioridade] = useState("baixa");

  // Novas Funcionalidades: Filtro e Pesquisa
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");

  // Persistência no localStorage
  useEffect(() => {
    localStorage.setItem("@taskflow:tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  // Funções Principais (Inalteradas)
  const adicionarTarefa = (e) => {
    e.preventDefault();
    if (!novoTexto.trim()) return;

    const novaTarefa = {
      id: Date.now(),
      texto: novoTexto,
      cidade: novaCidade,
      prioridade: novaPrioridade,
      status: "afazer",
      coluna: "afazer"
    };

    setTarefas((prev) => [...prev, novaTarefa]);
    setNovoTexto("");
    setNovaCidade("");
    setNovaPrioridade("baixa");
  };

  const moverTarefa = async (id, novaColuna) => {
    const colunasValidas = ["afazer", "andamento", "concluido"];
    if (!colunasValidas.includes(novaColuna)) return;

    setTarefas((prev) =>
      prev.map((t) =>
        String(t.id) === String(id)
          ? { ...t, coluna: novaColuna, status: novaColuna }
          : t
      )
    );
  };

  const deletarTarefa = (id) => {
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  };

  // Lógica de Filtragem (Muda apenas a visualização, não apaga dados)
  const tarefasFiltradas = tarefas.filter((t) => {
    const bateTexto = t.texto.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
                      (t.cidade && t.cidade.toLowerCase().includes(termoPesquisa.toLowerCase()));
    const batePrioridade = filtroPrioridade === "todas" || t.prioridade === filtroPrioridade;
    return bateTexto && batePrioridade;
  });

  const tarefasAfazer = tarefasFiltradas.filter((t) => (t.coluna || t.status) === "afazer");
  const tarefasAndamento = tarefasFiltradas.filter((t) => (t.coluna || t.status) === "andamento");
  const tarefasConcluido = tarefasFiltradas.filter((t) => (t.coluna || t.status) === "concluido");

  // Estatísticas Rápidas
  const totalGeral = tarefas.length;
  const totalConcluidas = tarefas.filter((t) => (t.coluna || t.status) === "concluido").length;
  const percentualConcluido = totalGeral > 0 ? Math.round((totalConcluidas / totalGeral) * 100) : 0;

  return (
    <div style={{ padding: "20px", color: "#f8fafc" }}>
      <h2>Painel de Tarefas</h2>

      {/* DASHBOARD / ESTATÍSTICAS */}
      <div style={{
        display: "flex",
        gap: "15px",
        marginBottom: "20px",
        background: "#1e293b",
        padding: "15px",
        borderRadius: "8px",
        justifyContent: "space-around",
        flexWrap: "wrap",
        textAlign: "center"
      }}>
        <div><strong>Total:</strong> {totalGeral}</div>
        <div><strong>A Fazer:</strong> {tarefas.filter(t => (t.coluna||t.status)==="afazer").length}</div>
        <div><strong>Em Andamento:</strong> {tarefas.filter(t => (t.coluna||t.status)==="andamento").length}</div>
        <div><strong>Concluídas:</strong> {totalConcluidas} ({percentualConcluido}%)</div>
      </div>

      {/* PAINEL DE PESQUISA E FILTROS */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        flexWrap: "wrap"
      }}>
        <input
          type="text"
          placeholder="🔍 Pesquisar tarefa ou cidade..."
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
          style={{
            flex: "1 1 200px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #475569",
            background: "#0f172a",
            color: "#fff"
          }}
        />

        <select
          value={filtroPrioridade}
          onChange={(e) => setFiltroPrioridade(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #475569",
            background: "#0f172a",
            color: "#fff"
          }}
        >
          <option value="todas">Todas as Prioridades</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      {/* FORMULÁRIO DE ADICIONAR */}
      <form
        onSubmit={adicionarTarefa}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          background: "#1e293b",
          padding: "15px",
          borderRadius: "8px",
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <input
          type="text"
          placeholder="Descrição da tarefa..."
          value={novoTexto}
          onChange={(e) => setNovoTexto(e.target.value)}
          required
          style={{
            flex: "1 1 200px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #475569",
            background: "#0f172a",
            color: "#fff"
          }}
        />

        <input
          type="text"
          placeholder="Cidade (opcional)"
          value={novaCidade}
          onChange={(e) => setNovaCidade(e.target.value)}
          style={{
            flex: "1 1 150px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #475569",
            background: "#0f172a",
            color: "#fff"
          }}
        />

        <select
          value={novaPrioridade}
          onChange={(e) => setNovaPrioridade(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #475569",
            background: "#0f172a",
            color: "#fff"
          }}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          + Adicionar
        </button>
      </form>

      {/* KANBAN */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px"
        }}
      >
        {/* A FAZER */}
        <div style={{ background: "#0f172a", padding: "15px", borderRadius: "8px" }}>
          <h3 style={{ borderBottom: "2px solid #ef4444", paddingBottom: "8px", marginTop: 0 }}>
            📌 A Fazer ({tarefasAfazer.length})
          </h3>
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {tarefasAfazer.map((tarefa) => (
              <TarefaItem
                key={tarefa.id}
                id={tarefa.id}
                texto={tarefa.texto}
                prioridade={tarefa.prioridade}
                cidade={tarefa.cidade}
                onDeletar={() => deletarTarefa(tarefa.id)}
                onMover={moverTarefa}
                colunaAnterior={null}
                colunaProxima="andamento"
              />
            ))}
          </ul>
        </div>

        {/* EM ANDAMENTO */}
        <div style={{ background: "#0f172a", padding: "15px", borderRadius: "8px" }}>
          <h3 style={{ borderBottom: "2px solid #f59e0b", paddingBottom: "8px", marginTop: 0 }}>
            ⏳ Em Andamento ({tarefasAndamento.length})
          </h3>
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {tarefasAndamento.map((tarefa) => (
              <TarefaItem
                key={tarefa.id}
                id={tarefa.id}
                texto={tarefa.texto}
                prioridade={tarefa.prioridade}
                cidade={tarefa.cidade}
                onDeletar={() => deletarTarefa(tarefa.id)}
                onMover={moverTarefa}
                colunaAnterior="afazer"
                colunaProxima="concluido"
              />
            ))}
          </ul>
        </div>

        {/* CONCLUÍDO */}
        <div style={{ background: "#0f172a", padding: "15px", borderRadius: "8px" }}>
          <h3 style={{ borderBottom: "2px solid #22c55e", paddingBottom: "8px", marginTop: 0 }}>
            ✅ Concluído ({tarefasConcluido.length})
          </h3>
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {tarefasConcluido.map((tarefa) => (
              <TarefaItem
                key={tarefa.id}
                id={tarefa.id}
                texto={tarefa.texto}
                prioridade={tarefa.prioridade}
                cidade={tarefa.cidade}
                concluida={true}
                onDeletar={() => deletarTarefa(tarefa.id)}
                onMover={moverTarefa}
                colunaAnterior="andamento"
                colunaProxima={null}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TarefaV1;