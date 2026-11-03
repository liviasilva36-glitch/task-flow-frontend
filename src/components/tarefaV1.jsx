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
        const { data: respostaApi } = await api.put(`/tarefas/${dados.id}`, dados);
        const tarefaEditada = { ...dados, ...respostaApi };
        setTarefas((tarefasAtuais) =>
          tarefasAtuais.map((t) => (t.id === dados.id ? tarefaEditada : t))
        );
      } else {
        const { data: respostaApi } = await api.post('/tarefas', dados);
        const novaTarefa = { ...dados, ...respostaApi };
        setTarefas((tarefasAtuais) => [...tarefasAtuais, novaTarefa]);
      }
      setModalAberto(false);
    } catch (e) {
      console.error(e);
      throw e;
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
      setErro('');
      const tarefaAtual = tarefas.find((t) => t.id === id);
      if (!tarefaAtual) return;

      const idPrioridadeNum = Number(
        tarefaAtual.idprioridade ?? 
        tarefaAtual.idPrioridade ?? 
        tarefaAtual.prioridade_id ?? 
        1
      );

      const textoFinal = tarefaAtual.texto || tarefaAtual.descricao || '';
      const usuarioIdNum = Number(tarefaAtual.usuarioId ?? tarefaAtual.usuario_id ?? 1);
      const projetoIdNum = Number(tarefaAtual.projetoId ?? tarefaAtual.projeto_id ?? 1);

      const payloadMovimentacao = {
        coluna: novaColuna,
        status: novaColuna,
        texto: textoFinal,
        descricao: textoFinal,
        idprioridade: idPrioridadeNum,
        usuario_id: usuarioIdNum,
        projeto_id: projetoIdNum
      };

      let tarefaMovida;

      try {
        const resposta = await api.put(`/tarefas/${id}`, payloadMovimentacao);
        tarefaMovida = resposta.data;
      } catch (errPrimario) {
        if (errPrimario.response?.status === 409) {
          const respostaFallback = await api.put(`/tarefas/${id}`, {
            coluna: novaColuna,
            status: novaColuna
          });
          tarefaMovida = respostaFallback.data;
        } else {
          throw errPrimario;
        }
      }

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((t) =>
          t.id === id
            ? { ...t, ...payloadMovimentacao, ...tarefaMovida, coluna: novaColuna }
            : t
        )
      );
    } catch (e) {
      setErro('Erro ao mover tarefa. Tente novamente.');
      console.error('Resposta da API:', e.response?.data || e.message);
    }
  }

  // =============================================================
  // 5. HELPER DE EXTRAÇÃO E FILTROS DE PRIORIDADE
  // =============================================================

  function obterNomePrioridade(tarefa) {
    const idPri = Number(tarefa.idprioridade ?? tarefa.idPrioridade ?? tarefa.prioridade_id);

    if (idPri === 3) return 'alta';
    if (idPri === 2) return 'media';
    if (idPri === 1) return 'baixa';

    if (idPri && prioridades.length > 0) {
      const priEncontrada = prioridades.find((p) => Number(p.id || p.idprioridade) === idPri);
      if (priEncontrada) {
        return String(priEncontrada.nome || priEncontrada.descricao).toLowerCase();
      }
    }

    if (typeof tarefa.prioridade === 'string' && tarefa.prioridade.trim() !== '') {
      return tarefa.prioridade.toLowerCase();
    }

    return 'baixa';
  }

  const tarefasNormalizadas = tarefas.map((t) => ({
    ...t,
    prioridade: obterNomePrioridade(t),
  }));

  const tarefasFiltradas = tarefasNormalizadas.filter((tarefa) => {
    if (filtroPrioridade === 'todas') return true;
    return tarefa.prioridade === filtroPrioridade.toLowerCase();
  });

  const tarefasOrdenadas = [...tarefasFiltradas].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)
  );

  // =============================================================
  // 6. INTERFACE
  // =============================================================
  return (
    <div className="kanban-wrapper">
      <Header titulo="TaskFlow" subtitulo="gerenciador de Tarefa 🚀" />

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
                prioridades={prioridades}
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
                prioridades={prioridades}
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
                prioridades={prioridades}
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

      <footer style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>TaskFlow 2026 - Prof. Alan Glei</p>
      </footer>
    </div>
  );
}

export default TarefaV1;