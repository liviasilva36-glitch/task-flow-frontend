
// =============================================================
// IMPORTS
// =============================================================

import Header from './Header';
import ListaTarefas from './ListaTarefas';
import { useState, useEffect } from 'react';
import ModalTarefa from './ModalTarefa';
import api from '../pages/api';

// =============================================================
// 1. ESTADO DA APLICAÇÃO
// =============================================================
function TarefaV1() {

  // ───────────────────────────────────────────────────────────
  // 1.1 Estados principais
  // ───────────────────────────────────────────────────────────
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState('afazer');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todas');
  const [tarefas, setTarefas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  // =============================================================
  // 2. EFEITOS
  // =============================================================

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro('');

        const [resTarefas, resUsuarios, resProjetos, resPrioridades] = await Promise.all([
          api.get('/tarefas'),
          api.get('/usuarios').catch(() => ({ data: [] })),
          api.get('/projetos').catch(() => ({ data: [] })),
          api.get('/prioridades').catch(() => ({ data: [] }))
        ]);

        setTarefas(resTarefas.data);
        setUsuarios(resUsuarios.data);
        setProjetos(resProjetos.data);
        setPrioridades(resPrioridades.data);
      } catch (e) {
        setErro('Erro ao carregar dados. Verifique a conexão com a API.');
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, []);

  useEffect(() => {
    const pendentes = tarefas.filter(
      (tarefa) => tarefa.coluna === 'afazer' || tarefa.coluna === 'andamento'
    ).length;
    if (pendentes > 0) {
      document.title = `(${pendentes}) TaskFlow`;
    } else {
      document.title = 'TaskFlow';
    }
  }, [tarefas]);

  // =============================================================
  // 3. FUNÇÕES DO MODAL
  // =============================================================

  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  }

  // =============================================================
  // 4. FUNÇÕES DE GERENCIAMENTO DE TAREFAS
  // =============================================================

  async function salvarTarefa(dados) {
    try {
      if (dados.id) {
        const { data: tarefaEditada } = await api.put(`/tarefas/${dados.id}`, dados);
        setTarefas((tarefasAtuais) =>
          tarefasAtuais.map((t) => (t.id === dados.id ? tarefaEditada : t))
        );
      } else {
        const { data: novaTarefa } = await api.post('/tarefas', dados);
        setTarefas((tarefasAtuais) => [...tarefasAtuais, novaTarefa]);
      }
      setModalAberto(false);
    } catch (e) {
      console.error(e);
      throw e; // Lança a exceção para que o ModalTarefa exiba as validações no ecrã
    }
  }

  async function deletarTarefa(id) {
    const confirmado = window.confirm('Tem certeza que deseja deletar esta tarefa?');
    if (!confirmado) return;

    try {
      await api.delete(`/tarefas/${id}`);
      setTarefas((tarefasAtuais) => tarefasAtuais.filter((tarefa) => tarefa.id !== id));
    } catch (e) {
      setErro('Erro ao deletar tarefa. Tente novamente.');
      console.error(e);
    }
  }

  async function moverTarefa(id, novaColuna) {
    try {
      const tarefaAtual = tarefas.find((t) => t.id === id);
      if (!tarefaAtual) return;

      const payloadAtualizado = { 
        ...tarefaAtual, 
        coluna: novaColuna,
        usuarioId: tarefaAtual.usuarioId || tarefaAtual.usuario_id || 1,
        projetoId: tarefaAtual.projetoId || tarefaAtual.projeto_id || 1
      };

      const { data: tarefaMovida } = await api.put(`/tarefas/${id}`, payloadAtualizado);

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((t) => (t.id === id ? tarefaMovida : t))
      );
    } catch (e) {
      setErro('Erro ao mover tarefa. Tente novamente.');
      console.error(e);
    }
  }

  // =============================================================
  // 5. FILTROS E ORDENAÇÃO
  // =============================================================

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtroPrioridade === 'todas') return true;
    return tarefa.prioridade === filtroPrioridade;
  });

  // DESAFIO 4: Ordena os cartões pela propriedade 'ordem'
  const tarefasOrdenadas = [...tarefasFiltradas].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)
  );

  // =============================================================
  // 6. INTERFACE
  // =============================================================
  return (
    <div className="container" id="app">
      <Header titulo="TaskFlow" subtitulo="gerenciador de Tarefa 🚀" />

      <main className="container">
        {carregando && (
          <p style={{ textAlign: 'center', color: '#94A3B8' }}>
            Carregando tarefas...
          </p>
        )}

        {erro && (
          <p style={{ textAlign: 'center', color: '#EF4444' }}>{erro}</p>
        )}

        <div className="filtro-prioridade">
          <label>Filtrar por prioridade:</label>
          <select
            className="btn-filtro"
            value={filtroPrioridade}
            onChange={(e) => setFiltroPrioridade(e.target.value)}
          >
            <option value="todas">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>

        {!carregando && !erro && (
          <>
            <div className="kanban-quadro">
              {/* COLUNA: A FAZER */}
              <div className="kanban-coluna">
                <div className="kanban-coluna-header">
                  <h3>A Fazer</h3>
                  <span className="kanban-contador">
                    {tarefas.filter((t) => t.coluna === 'afazer').length}
                  </span>
                  <button
                    className="kanban-btn-add"
                    onClick={() => abrirModalCriar('afazer')}
                  >
                    +
                  </button>
                </div>

                <ListaTarefas
                  tarefas={tarefasOrdenadas.filter((t) => t.coluna === 'afazer')}
                  usuarios={usuarios}
                  onDeletar={deletarTarefa}
                  onEditar={abrirModalEditar}
                  onMover={moverTarefa}
                  colunaAnterior={null}
                  colunaProxima="andamento"
                />
              </div>

              {/* COLUNA: EM ANDAMENTO */}
              <div className="kanban-coluna">
                <div className="kanban-coluna-header">
                  <h3>Em Andamento</h3>
                  <span className="kanban-contador">
                    {tarefas.filter((t) => t.coluna === 'andamento').length}
                  </span>
                  <button
                    className="kanban-btn-add"
                    onClick={() => abrirModalCriar('andamento')}
                  >
                    +
                  </button>
                </div>
                <ListaTarefas
                  tarefas={tarefasOrdenadas.filter((t) => t.coluna === 'andamento')}
                  usuarios={usuarios}
                  onDeletar={deletarTarefa}
                  onEditar={abrirModalEditar}
                  onMover={moverTarefa}
                  colunaAnterior="afazer"
                  colunaProxima="concluido"
                />
              </div>

              {/* COLUNA: CONCLUÍDO */}
              <div className="kanban-coluna">
                <div className="kanban-coluna-header">
                  <h3>Concluído</h3>
                  <span className="kanban-contador">
                    {tarefas.filter((t) => t.coluna === 'concluido').length}
                  </span>
                  <button
                    className="kanban-btn-add"
                    onClick={() => abrirModalCriar('concluido')}
                  >
                    +
                  </button>
                </div>
                <ListaTarefas
                  tarefas={tarefasOrdenadas.filter((t) => t.coluna === 'concluido')}
                  usuarios={usuarios}
                  onDeletar={deletarTarefa}
                  onEditar={abrirModalEditar}
                  onMover={moverTarefa}
                  colunaAnterior="andamento"
                  colunaProxima={null}
                />
              </div>
            </div>

            <ModalTarefa
              aberto={modalAberto}
              onFechar={() => setModalAberto(false)}
              onSalvar={salvarTarefa}
              tarefa={tarefaEditando}
              coluna={colunaAtiva}
              usuarios={usuarios}
              projetos={projetos}
              prioridades={prioridades}
            />
          </>
        )}
      </main>

      <footer>
        <p>TaskFlow 2026 - Prof. Alan Glei</p>
      </footer>
    </div>
  );
}

export default TarefaV1;