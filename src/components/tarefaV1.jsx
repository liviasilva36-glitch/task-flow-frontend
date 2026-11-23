// import React, { useState, useEffect } from "react";
// import TarefaItem from "./TarefaItem";

// export function TarefaV1() {
//   // 1. Carrega as tarefas do localStorage
//   const [tarefas, setTarefas] = useState(() => {
//     const salvas = localStorage.getItem("@taskflow:tarefas");
//     if (salvas) {
//       try {
//         return JSON.parse(salvas);
//       } catch (e) {
//         console.error("Erro ao carregar do localStorage", e);
//       }
//     }
//     return [
//       { id: 1, texto: "Estudar React", status: "afazer", coluna: "afazer", prioridade: "alta", cidade: "São Paulo" },
//       { id: 2, texto: "Criar componente Kanban", status: "andamento", coluna: "andamento", prioridade: "media", cidade: "Rio de Janeiro" },
//       { id: 3, texto: "Configurar Rotas", status: "concluido", coluna: "concluido", prioridade: "baixa", cidade: "Curitiba" }
//     ];
//   });

//   // Estados do formulário
//   const [novoTexto, setNovoTexto] = useState("");
//   const [novaCidade, setNovaCidade] = useState("");
//   const [novaPrioridade, setNovaPrioridade] = useState("baixa");

//   // Novas Funcionalidades: Filtro e Pesquisa
//   const [termoPesquisa, setTermoPesquisa] = useState("");
//   const [filtroPrioridade, setFiltroPrioridade] = useState("todas");

//   // Persistência no localStorage
//   useEffect(() => {
//     localStorage.setItem("@taskflow:tarefas", JSON.stringify(tarefas));
//   }, [tarefas]);

//   // Funções Principais (Inalteradas)
//   const adicionarTarefa = (e) => {
//     e.preventDefault();
//     if (!novoTexto.trim()) return;

//     const novaTarefa = {
//       id: Date.now(),
//       texto: novoTexto,
//       cidade: novaCidade,
//       prioridade: novaPrioridade,
//       status: "afazer",
//       coluna: "afazer"
//     };

//     setTarefas((prev) => [...prev, novaTarefa]);
//     setNovoTexto("");
//     setNovaCidade("");
//     setNovaPrioridade("baixa");
//   };

//   const moverTarefa = async (id, novaColuna) => {
//     const colunasValidas = ["afazer", "andamento", "concluido"];
//     if (!colunasValidas.includes(novaColuna)) return;

//     setTarefas((prev) =>
//       prev.map((t) =>
//         String(t.id) === String(id)
//           ? { ...t, coluna: novaColuna, status: novaColuna }
//           : t
//       )
//     );
//   };

//   const deletarTarefa = (id) => {
//     setTarefas((prev) => prev.filter((t) => t.id !== id));
//   };

//   // Lógica de Filtragem (Muda apenas a visualização, não apaga dados)
//   const tarefasFiltradas = tarefas.filter((t) => {
//     const bateTexto = t.texto.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
//                       (t.cidade && t.cidade.toLowerCase().includes(termoPesquisa.toLowerCase()));
//     const batePrioridade = filtroPrioridade === "todas" || t.prioridade === filtroPrioridade;
//     return bateTexto && batePrioridade;
//   });

//   const tarefasAfazer = tarefasFiltradas.filter((t) => (t.coluna || t.status) === "afazer");
//   const tarefasAndamento = tarefasFiltradas.filter((t) => (t.coluna || t.status) === "andamento");
//   const tarefasConcluido = tarefasFiltradas.filter((t) => (t.coluna || t.status) === "concluido");

//   // Estatísticas Rápidas
//   const totalGeral = tarefas.length;
//   const totalConcluidas = tarefas.filter((t) => (t.coluna || t.status) === "concluido").length;
//   const percentualConcluido = totalGeral > 0 ? Math.round((totalConcluidas / totalGeral) * 100) : 0;

//   return (
//     <div style={{ padding: "20px", color: "#f8fafc" }}>
//       <h2>Painel de Tarefas</h2>

//       {/* DASHBOARD / ESTATÍSTICAS */}
//       <div style={{
//         display: "flex",
//         gap: "15px",
//         marginBottom: "20px",
//         background: "#1e293b",
//         padding: "15px",
//         borderRadius: "8px",
//         justifyContent: "space-around",
//         flexWrap: "wrap",
//         textAlign: "center"
//       }}>
//         <div><strong>Total:</strong> {totalGeral}</div>
//         <div><strong>A Fazer:</strong> {tarefas.filter(t => (t.coluna||t.status)==="afazer").length}</div>
//         <div><strong>Em Andamento:</strong> {tarefas.filter(t => (t.coluna||t.status)==="andamento").length}</div>
//         <div><strong>Concluídas:</strong> {totalConcluidas} ({percentualConcluido}%)</div>
//       </div>

//       {/* PAINEL DE PESQUISA E FILTROS */}
//       <div style={{
//         display: "flex",
//         gap: "10px",
//         marginBottom: "20px",
//         flexWrap: "wrap"
//       }}>
//         <input
//           type="text"
//           placeholder="🔍 Pesquisar tarefa ou cidade..."
//           value={termoPesquisa}
//           onChange={(e) => setTermoPesquisa(e.target.value)}
//           style={{
//             flex: "1 1 200px",
//             padding: "8px 12px",
//             borderRadius: "6px",
//             border: "1px solid #475569",
//             background: "#0f172a",
//             color: "#fff"
//           }}
//         />

//         <select
//           value={filtroPrioridade}
//           onChange={(e) => setFiltroPrioridade(e.target.value)}
//           style={{
//             padding: "8px 12px",
//             borderRadius: "6px",
//             border: "1px solid #475569",
//             background: "#0f172a",
//             color: "#fff"
//           }}
//         >
//           <option value="todas">Todas as Prioridades</option>
//           <option value="baixa">Baixa</option>
//           <option value="media">Média</option>
//           <option value="alta">Alta</option>
//         </select>
//       </div>

//       {/* FORMULÁRIO DE ADICIONAR */}
//       <form
//         onSubmit={adicionarTarefa}
//         style={{
//           display: "flex",
//           gap: "10px",
//           marginBottom: "25px",
//           background: "#1e293b",
//           padding: "15px",
//           borderRadius: "8px",
//           flexWrap: "wrap",
//           alignItems: "center"
//         }}
//       >
//         <input
//           type="text"
//           placeholder="Descrição da tarefa..."
//           value={novoTexto}
//           onChange={(e) => setNovoTexto(e.target.value)}
//           required
//           style={{
//             flex: "1 1 200px",
//             padding: "8px 12px",
//             borderRadius: "6px",
//             border: "1px solid #475569",
//             background: "#0f172a",
//             color: "#fff"
//           }}
//         />

//         <input
//           type="text"
//           placeholder="Cidade (opcional)"
//           value={novaCidade}
//           onChange={(e) => setNovaCidade(e.target.value)}
//           style={{
//             flex: "1 1 150px",
//             padding: "8px 12px",
//             borderRadius: "6px",
//             border: "1px solid #475569",
//             background: "#0f172a",
//             color: "#fff"
//           }}
//         />

//         <select
//           value={novaPrioridade}
//           onChange={(e) => setNovaPrioridade(e.target.value)}
//           style={{
//             padding: "8px 12px",
//             borderRadius: "6px",
//             border: "1px solid #475569",
//             background: "#0f172a",
//             color: "#fff"
//           }}
//         >
//           <option value="baixa">Baixa</option>
//           <option value="media">Média</option>
//           <option value="alta">Alta</option>
//         </select>

//         <button
//           type="submit"
//           style={{
//             padding: "8px 16px",
//             background: "#22c55e",
//             color: "#fff",
//             border: "none",
//             borderRadius: "6px",
//             fontWeight: "bold",
//             cursor: "pointer"
//           }}
//         >
//           + Adicionar
//         </button>
//       </form>

//       {/* KANBAN */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//           gap: "20px"
//         }}
//       >
//         {/* A FAZER */}
//         <div style={{ background: "#0f172a", padding: "15px", borderRadius: "8px" }}>
//           <h3 style={{ borderBottom: "2px solid #ef4444", paddingBottom: "8px", marginTop: 0 }}>
//             📌 A Fazer ({tarefasAfazer.length})
//           </h3>
//           <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
//             {tarefasAfazer.map((tarefa) => (
//               <TarefaItem
//                 key={tarefa.id}
//                 id={tarefa.id}
//                 texto={tarefa.texto}
//                 prioridade={tarefa.prioridade}
//                 cidade={tarefa.cidade}
//                 onDeletar={() => deletarTarefa(tarefa.id)}
//                 onMover={moverTarefa}
//                 colunaAnterior={null}
//                 colunaProxima="andamento"
//               />
//             ))}
//           </ul>
//         </div>

//         {/* EM ANDAMENTO */}
//         <div style={{ background: "#0f172a", padding: "15px", borderRadius: "8px" }}>
//           <h3 style={{ borderBottom: "2px solid #f59e0b", paddingBottom: "8px", marginTop: 0 }}>
//             ⏳ Em Andamento ({tarefasAndamento.length})
//           </h3>
//           <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
//             {tarefasAndamento.map((tarefa) => (
//               <TarefaItem
//                 key={tarefa.id}
//                 id={tarefa.id}
//                 texto={tarefa.texto}
//                 prioridade={tarefa.prioridade}
//                 cidade={tarefa.cidade}
//                 onDeletar={() => deletarTarefa(tarefa.id)}
//                 onMover={moverTarefa}
//                 colunaAnterior="afazer"
//                 colunaProxima="concluido"
//               />
//             ))}
//           </ul>
//         </div>

//         {/* CONCLUÍDO */}
//         <div style={{ background: "#0f172a", padding: "15px", borderRadius: "8px" }}>
//           <h3 style={{ borderBottom: "2px solid #22c55e", paddingBottom: "8px", marginTop: 0 }}>
//             ✅ Concluído ({tarefasConcluido.length})
//           </h3>
//           <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
//             {tarefasConcluido.map((tarefa) => (
//               <TarefaItem
//                 key={tarefa.id}
//                 id={tarefa.id}
//                 texto={tarefa.texto}
//                 prioridade={tarefa.prioridade}
//                 cidade={tarefa.cidade}
//                 concluida={true}
//                 onDeletar={() => deletarTarefa(tarefa.id)}
//                 onMover={moverTarefa}
//                 colunaAnterior="andamento"
//                 colunaProxima={null}
//               />
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TarefaV1;






import React, { useState, useEffect } from "react";
import TarefaItem from "./TarefaItem";
import api, { mensagensDeErro } from "../pages/api";

export function TarefaV1() {
  const [tarefas, setTarefas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // ID do utilizador selecionado/ativo mantido em memória de estado React
  const [usuarioId, setUsuarioId] = useState("");

  // Estados do formulário de criação
  const [novoNome, setNovoNome] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaPrioridade, setNovaPrioridade] = useState("baixa");

  // Filtros de visualização
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");

  // 1. CARREGAR UTILIZADORES E TAREFAS DA API AO INICIAR
  const carregarDadosIniciais = async () => {
    try {
      setCarregando(true);
      
      const [resUsuarios, resTarefas] = await Promise.all([
        api.get("/usuarios"),
        api.get("/tarefas")
      ]);

      setUsuarios(resUsuarios.data || []);
      setTarefas(resTarefas.data || []);

      if (resUsuarios.data && resUsuarios.data.length > 0) {
        setUsuarioId(resUsuarios.data[0].id);
      }
      
      setErro("");
    } catch (err) {
      console.error("Erro ao carregar dados da API:", err);
      setErro(mensagensDeErro(err)[0]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  // 2. ADICIONAR TAREFA DIRETAMENTE NO BANCO DE DADOS
  const adicionarTarefa = async (e) => {
    e.preventDefault();
    if (!novoNome.trim()) return;
    if (!usuarioId) {
      alert("Selecione um utilizador responsável!");
      return;
    }

    const novaTarefaPayload = {
      nome: novoNome,
      descricao: novaDescricao || null,
      usuario_id: Number(usuarioId),
      status: "afazer",
      coluna: "afazer",
      prioridade: novaPrioridade
    };

    try {
      const resposta = await api.post("/tarefas", novaTarefaPayload);
      
      setTarefas((prev) => [...prev, resposta.data]);
      setNovoNome("");
      setNovaDescricao("");
      setNovaPrioridade("baixa");
    } catch (err) {
      alert("Erro ao criar tarefa: " + mensagensDeErro(err)[0]);
    }
  };

  // 3. MOVER TAREFA NA API
  const moverTarefa = async (id, novaColuna) => {
    setTarefas((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, coluna: novaColuna, status: novaColuna } : t
      )
    );

    try {
      await api.patch(`/tarefas/${id}`, { status: novaColuna });
    } catch (err) {
      console.error("Erro ao atualizar status na API:", err);
      carregarDadosIniciais();
    }
  };

  // 4. ELIMINAR TAREFA NA API
  const deletarTarefa = async (id) => {
    try {
      await api.delete(`/tarefas/${id}`);
      setTarefas((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Erro ao eliminar tarefa: " + mensagensDeErro(err)[0]);
    }
  };

  // FILTRAGEM VISUAL
  const tarefasFiltradas = tarefas.filter((t) => {
    const nomeTarefa = t.nome || t.texto || t.titulo || "";
    const nomeAutor = t.usuarios?.nome || "";
    const bateTexto =
      nomeTarefa.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      nomeAutor.toLowerCase().includes(termoPesquisa.toLowerCase());

    const batePrioridade =
      filtroPrioridade === "todas" || t.prioridade === filtroPrioridade;

    return bateTexto && batePrioridade;
  });

  const tarefasAfazer = tarefasFiltradas.filter((t) => (t.status || t.coluna || "afazer") === "afazer");
  const tarefasAndamento = tarefasFiltradas.filter((t) => (t.status || t.coluna) === "andamento");
  const tarefasConcluido = tarefasFiltradas.filter((t) => (t.status || t.coluna) === "concluido");

  // Função auxiliar para formatar o texto a apresentar no card
  const formatarTextoTarefa = (tarefa) => {
    const titulo = tarefa.nome || tarefa.texto || tarefa.titulo || "Sem título";
    const autor = tarefa.usuarios?.nome ? ` (${tarefa.usuarios.nome})` : "";
    return `${titulo}${autor}`;
  };

  return (
    <div style={{ padding: "20px", color: "#f8fafc" }}>
      <h2>Painel de Tarefas</h2>

      {erro && (
        <div style={{ background: "#ef444422", color: "#f87171", padding: "10px", borderRadius: "6px", marginBottom: "15px" }}>
          {erro}
        </div>
      )}

      {/* PAINEL DE SELEÇÃO DE UTILIZADOR & PESQUISA */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        
        <div>
          <label style={{ fontSize: "0.85rem", color: "#a8b1c7", marginRight: "6px" }}>Utilizador Ativo:</label>
          <select
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #475569",
              background: "#1e293b",
              color: "#fff"
            }}
          >
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="🔍 Pesquisar tarefa ou responsável..."
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

      {/* FORMULÁRIO DE ADICIONAR TAREFA */}
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
          placeholder="Nome da tarefa..."
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
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
          placeholder="Descrição (opcional)"
          value={novaDescricao}
          onChange={(e) => setNovaDescricao(e.target.value)}
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

      {/* QUADRO KANBAN */}
      {carregando ? (
        <div style={{ textAlign: "center", padding: "40px" }}>A carregar dados do banco...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          
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
                  nome={tarefa.nome}
                  texto={formatarTextoTarefa(tarefa)}
                  usuarios={tarefa.usuarios}
                  prioridade={tarefa.prioridade || "media"}
                  cidade={tarefa.descricao || ""}
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
                  nome={tarefa.nome}
                  texto={formatarTextoTarefa(tarefa)}
                  usuarios={tarefa.usuarios}
                  prioridade={tarefa.prioridade || "media"}
                  cidade={tarefa.descricao || ""}
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
                  nome={tarefa.nome}
                  texto={formatarTextoTarefa(tarefa)}
                  usuarios={tarefa.usuarios}
                  prioridade={tarefa.prioridade || "media"}
                  cidade={tarefa.descricao || ""}
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
      )}
    </div>
  );
}

export default TarefaV1;

