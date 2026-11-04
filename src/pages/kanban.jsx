import { useState, useEffect } from "react";
import api, { mensagensDeErro } from "../api";
import ListaTarefas from "../components/ListaTarefas";
import ModalTarefa from "../components/ModalTarefa";
import "./Kanban.css";

function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [listaPrioridades, setListaPrioridades] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaProjetos, setListaProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      try {
        const [respPrioridades, respTarefas, respUsuarios, respProjetos] =
          await Promise.all([
            api.get("/prioridades"),
            api.get("/tarefas"),
            api.get("/usuarios"),
            api.get("/projetos"),
          ]);

        setListaPrioridades(respPrioridades.data);
        setTarefas(respTarefas.data);
        setListaUsuarios(respUsuarios.data);
        setListaProjetos(respProjetos.data);
      } catch (err) {
        alert(mensagensDeErro(err).join("\n"));
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  async function salvarTarefa(dados) {
    if (dados.id) {
      await api.put(`/tarefas/${dados.id}`, dados);
    } else {
      await api.post("/tarefas", dados);
    }
    const respTarefas = await api.get("/tarefas");
    setTarefas(respTarefas.data);
  }

  // Mover tarefa simplificado (envia apenas a coluna e o texto para evitar falhas de FK)
  async function moverTarefa(tarefaOuId, novaColuna) {
    try {
      const tarefa = typeof tarefaOuId === 'object' 
        ? tarefaOuId 
        : tarefas.find(t => t.id === tarefaOuId);

      if (!tarefa) return;

      const payload = {
        texto: tarefa.texto || "Sem título",
        coluna: novaColuna,
        status: novaColuna,
      };

      await api.put(`/tarefas/${tarefa.id}`, payload);

      const respTarefas = await api.get("/tarefas");
      setTarefas(respTarefas.data);
    } catch (e) {
      alert(mensagensDeErro(e).join("\n"));
    }
  }

  async function deletarTarefa(id) {
    try {
      await api.delete(`/tarefas/${id}`);
      setTarefas((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      alert(mensagensDeErro(e).join("\n"));
    }
  }

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setColunaAtiva(tarefa.coluna);
    setModalAberto(true);
  }

  if (carregando) return <div>A carregar Kanban...</div>;

  return (
    <div className="kanban-container">
      <h1>Quadro Kanban</h1>

      <div className="kanban-colunas" style={{ display: "flex", gap: "20px" }}>
        <ListaTarefas
          coluna="afazer"
          titulo="A Fazer"
          tarefas={tarefas.filter((t) => t.coluna === "afazer")}
          prioridades={listaPrioridades}
          usuarios={listaUsuarios}
          colunaProxima="andamento"
          onDeletar={deletarTarefa}
          onMover={moverTarefa}
          onEditar={abrirModalEditar}
        />

        <ListaTarefas
          coluna="andamento"
          titulo="Em Andamento"
          tarefas={tarefas.filter((t) => t.coluna === "andamento")}
          prioridades={listaPrioridades}
          usuarios={listaUsuarios}
          colunaAnterior="afazer"
          colunaProxima="concluido"
          onDeletar={deletarTarefa}
          onMover={moverTarefa}
          onEditar={abrirModalEditar}
        />

        <ListaTarefas
          coluna="concluido"
          titulo="Concluído"
          tarefas={tarefas.filter((t) => t.coluna === "concluido")}
          prioridades={listaPrioridades}
          usuarios={listaUsuarios}
          colunaAnterior="andamento"
          onDeletar={deletarTarefa}
          onMover={moverTarefa}
          onEditar={abrirModalEditar}
        />
      </div>

      <ModalTarefa
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={salvarTarefa}
        tarefa={tarefaEditando}
        coluna={colunaAtiva}
        prioridades={listaPrioridades}
        usuarios={listaUsuarios}
        projetos={listaProjetos}
      />
    </div>
  );
}

export default Kanban;