// import { useState, useEffect } from "react";
// import api, { mensagensDeErro } from "../api";
// import ListaTarefas from "../components/ListaTarefas";
// import ModalTarefa from "../components/ModalTarefa";
// import "./Kanban.css";

// function Kanban() {
//   const [tarefas, setTarefas] = useState([]);
//   const [listaPrioridades, setListaPrioridades] = useState([]);
//   const [listaUsuarios, setListaUsuarios] = useState([]);
//   const [listaProjetos, setListaProjetos] = useState([]);
//   const [carregando, setCarregando] = useState(true);

//   // Estados do Modal
//   const [modalAberto, setModalAberto] = useState(false);
//   const [tarefaEditando, setTarefaEditando] = useState(null);
//   const [colunaAtiva, setColunaAtiva] = useState("afazer");

//   useEffect(() => {
//     async function carregarDados() {
//       setCarregando(true);
//       try {
//         const [respPrioridades, respTarefas, respUsuarios, respProjetos] =
//           await Promise.all([
//             api.get("/prioridades"),
//             api.get("/tarefas"),
//             api.get("/usuarios"),
//             api.get("/projetos"),
//           ]);

//         setListaPrioridades(respPrioridades.data);
//         setTarefas(respTarefas.data);
//         setListaUsuarios(respUsuarios.data);
//         setListaProjetos(respProjetos.data);
//       } catch (err) {
//         alert(mensagensDeErro(err).join("\n"));
//       } finally {
//         setCarregando(false);
//       }
//     }

//     carregarDados();
//   }, []);

//   // 1 & 2. salvarTarefa SEM try/catch (o erro sobe para o modal)
//   async function salvarTarefa(dados) {
//     if (dados.id) {
//       const resposta = await api.put(`/tarefas/${dados.id}`, dados);
//       setTarefas(tarefas.map((t) => (t.id === dados.id ? resposta.data : t)));
//     } else {
//       const resposta = await api.post("/tarefas", dados);
//       setTarefas([...tarefas, resposta.data]);
//     }
//     const respTarefas = await api.get("/tarefas");
//     setTarefas(respTarefas.data);
//   }

//   // 3 & 4. moverTarefa envia a tarefa COMPLETA e exibe alert no catch
//   async function moverTarefa(tarefa, novaColuna) {
//     try {
//       const resposta = await api.put(`/tarefas/${tarefa.id}`, {
//         ...tarefa,
//         coluna: novaColuna,
//       });
//       setTarefas(tarefas.map((t) => (t.id === tarefa.id ? resposta.data : t)));
//     } catch (e) {
//       alert(mensagensDeErro(e).join("\n"));
//     }
//   }

//   // 4. deletarTarefa com alert no catch
//   async function deletarTarefa(id) {
//     try {
//       await api.delete(`/tarefas/${id}`);
//       setTarefas((prev) => prev.filter((t) => t.id !== id));
//     } catch (e) {
//       alert(mensagensDeErro(e).join("\n"));
//     }
//   }

//   if (carregando) return <div>A carregar Kanban...</div>;

//   return (
//     <div className="kanban-container">
//       <h1>Quadro Kanban</h1>

//       <div className="kanban-colunas" style={{ display: "flex", gap: "20px" }}>
//         <ListaTarefas
//           coluna="afazer"
//           titulo="A Fazer"
//           tarefas={tarefas.filter((t) => t.coluna === "afazer")}
//           prioridades={listaPrioridades}
//           onDeletar={deletarTarefa}
//           onMover={moverTarefa}
//         />

//         <ListaTarefas
//           coluna="andamento"
//           titulo="Em Andamento"
//           tarefas={tarefas.filter((t) => t.coluna === "andamento")}
//           prioridades={listaPrioridades}
//           onDeletar={deletarTarefa}
//           onMover={moverTarefa}
//         />

//         <ListaTarefas
//           coluna="concluido"
//           titulo="Concluído"
//           tarefas={tarefas.filter((t) => t.coluna === "concluido")}
//           prioridades={listaPrioridades}
//           onDeletar={deletarTarefa}
//           onMover={moverTarefa}
//         />
//       </div>

//       <ModalTarefa
//         aberto={modalAberto}
//         onFechar={() => setModalAberto(false)}
//         onSalvar={salvarTarefa}
//         tarefa={tarefaEditando}
//         coluna={colunaAtiva}
//         prioridades={listaPrioridades}
//         usuarios={listaUsuarios}
//         projetos={listaProjetos}
//       />
//     </div>
//   );
// }

// export default Kanban;
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

  // Suporta receber o objeto tarefa ou id direto
  async function moverTarefa(tarefaOuId, novaColuna) {
    try {
      const tarefa = typeof tarefaOuId === 'object' 
        ? tarefaOuId 
        : tarefas.find(t => t.id === tarefaOuId);

      if (!tarefa) return;

      const resposta = await api.put(`/tarefas/${tarefa.id}`, {
        ...tarefa,
        coluna: novaColuna,
      });

      setTarefas((prev) =>
        prev.map((t) => (t.id === tarefa.id ? resposta.data : t))
      );
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