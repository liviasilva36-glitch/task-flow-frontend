
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

  // Carregar dados
  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);

      try {
        const [
          respPrioridades,
          respTarefas,
          respUsuarios,
          respProjetos
        ] = await Promise.all([
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

  // Salvar ou editar tarefa
  async function salvarTarefa(dados) {
    try {
      if (dados.id) {
        await api.put(`/tarefas/${dados.id}`, dados);
      } else {
        await api.post("/tarefas", dados);
      }

      const resposta = await api.get("/tarefas");
      setTarefas(resposta.data);

      setModalAberto(false);
      setTarefaEditando(null);

    } catch (erro) {
      alert(mensagensDeErro(erro).join("\n"));
    }
  }

  // MOVER TAREFA NO KANBAN
  async function moverTarefa(tarefaOuId, novaColuna) {
    try {
      // Localizar a tarefa
      const tarefa =
        typeof tarefaOuId === "object"
          ? tarefaOuId
          : tarefas.find(
              (t) => String(t.id) === String(tarefaOuId)
            );

      if (!tarefa) {
        alert("Tarefa não encontrada!");
        return;
      }

      // Validar coluna de destino
      const colunasValidas = [
        "afazer",
        "andamento",
        "concluido"
      ];

      if (!colunasValidas.includes(novaColuna)) {
        alert("Coluna de destino inválida!");
        return;
      }

      // Não fazer nada se já estiver na coluna
      if (tarefa.coluna === novaColuna) {
        return;
      }

      // Enviar somente a nova coluna
      const payload = {
        coluna: novaColuna
      };

      // Atualizar no banco de dados
      await api.put(`/tarefas/${tarefa.id}`, payload);

      // Atualizar os cartões na tela
      setTarefas((anteriores) =>
        anteriores.map((t) =>
          String(t.id) === String(tarefa.id)
            ? {
                ...t,
                coluna: novaColuna,
                status: novaColuna
              }
            : t
        )
      );

      console.log("Tarefa movida com sucesso!");

    } catch (erro) {
      console.error(
        "Erro ao mover tarefa:",
        erro.response?.data || erro
      );

      alert(
        mensagensDeErro(erro).join("\n") ||
        "Não foi possível mover a tarefa."
      );
    }
  }

  // Excluir tarefa
  async function deletarTarefa(id) {
    try {
      await api.delete(`/tarefas/${id}`);

      setTarefas((anteriores) =>
        anteriores.filter(
          (t) => String(t.id) !== String(id)
        )
      );

    } catch (erro) {
      alert(mensagensDeErro(erro).join("\n"));
    }
  }

  // Abrir modal para editar
  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setColunaAtiva(tarefa.coluna);
    setModalAberto(true);
  }

  if (carregando) {
    return <div>Carregando Kanban...</div>;
  }

  return (
    <div className="kanban-container">

      <h1>Quadro Kanban</h1>

      <div
        className="kanban-colunas"
        style={{
          display: "flex",
          gap: "20px"
        }}
      >

        {/* COLUNA A FAZER */}
        <ListaTarefas
          coluna="afazer"
          titulo="A Fazer"
          tarefas={tarefas.filter(
            (t) => t.coluna === "afazer"
          )}
          prioridades={listaPrioridades}
          usuarios={listaUsuarios}
          colunaProxima="andamento"
          onDeletar={deletarTarefa}
          onMover={moverTarefa}
          onEditar={abrirModalEditar}
        />

        {/* COLUNA EM ANDAMENTO */}
        <ListaTarefas
          coluna="andamento"
          titulo="Em Andamento"
          tarefas={tarefas.filter(
            (t) => t.coluna === "andamento"
          )}
          prioridades={listaPrioridades}
          usuarios={listaUsuarios}
          colunaAnterior="afazer"
          colunaProxima="concluido"
          onDeletar={deletarTarefa}
          onMover={moverTarefa}
          onEditar={abrirModalEditar}
        />

        {/* COLUNA CONCLUÍDO */}
        <ListaTarefas
          coluna="concluido"
          titulo="Concluído"
          tarefas={tarefas.filter(
            (t) => t.coluna === "concluido"
          )}
          prioridades={listaPrioridades}
          usuarios={listaUsuarios}
          colunaAnterior="andamento"
          onDeletar={deletarTarefa}
          onMover={moverTarefa}
          onEditar={abrirModalEditar}
        />

      </div>

      {/* MODAL DE TAREFAS */}
      <ModalTarefa
        aberto={modalAberto}
        onFechar={() => {
          setModalAberto(false);
          setTarefaEditando(null);
        }}
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
