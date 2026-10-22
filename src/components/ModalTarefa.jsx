import { useEffect, useState } from "react";
// Importação com extensão .js explícita para evitar erros de resolução do Vite
import { mensagensDeErro } from "../pages/api.js";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ModalTarefa.module.css";

// Função para converter valor do select para número ou null se vazio
function paraNumero(valor) {
  return valor ? Number(valor) : null;
}

function ModalTarefa({
  aberto,
  onFechar,
  onSalvar,
  tarefa = null,
  coluna = "afazer",
  prioridades = [],
  usuarios = [],
  projetos = [],
}) {
  const { usuario } = useAuth();

  const [texto, setTexto] = useState("");
  const [idPrioridade, setIdPrioridade] = useState(2); // ID padrão
  const [idUsuario, setIdUsuario] = useState("");
  const [idProjeto, setIdProjeto] = useState("");
  const [erros, setErros] = useState([]);
  const [salvando, setSalvando] = useState(false);

  // Filtra apenas os projetos pertencentes ao responsável selecionado
  const projetosDoUsuario = projetos.filter(
    (p) => Number(p.usuario_id || p.usuarioId) === Number(idUsuario),
  );

  // Preenche os campos SOMENTE quando o modal é aberto ou quando a tarefa selecionada muda
  useEffect(() => {
    if (!aberto) return;

    setErros([]);

    if (tarefa) {
      setTexto(tarefa.texto || tarefa.descricao || "");
      setIdPrioridade(
        tarefa.idprioridade ?? tarefa.idPrioridade ?? tarefa.prioridade_id ?? 2,
      );
      setIdUsuario(tarefa.usuarioId ?? tarefa.usuario_id ?? "");
      setIdProjeto(tarefa.projetoId ?? tarefa.projeto_id ?? "");
    } else {
      const usuarioPadrao = usuario?.id || usuarios[0]?.id || "";
      const prioridadePadrao = prioridades[0]?.id || 2;

      setTexto("");
      setIdPrioridade(prioridadePadrao);
      setIdUsuario(usuarioPadrao);

      // Define o primeiro projeto do responsável selecionado por padrão
      const projetosFiltrados = projetos.filter(
        (p) => Number(p.usuario_id || p.usuarioId) === Number(usuarioPadrao),
      );
      setIdProjeto(projetosFiltrados[0]?.id || projetos[0]?.id || "");
    }
  }, [aberto, tarefa?.id]);

  // Quando o usuário muda o responsável no select, ajusta o projeto selecionado
  function handleUsuarioChange(novoIdUsuario) {
    setIdUsuario(novoIdUsuario);
    const projetosFiltrados = projetos.filter(
      (p) => Number(p.usuario_id || p.usuarioId) === Number(novoIdUsuario),
    );
    setIdProjeto(projetosFiltrados[0]?.id || "");
  }

  // Função para guardar/enviar a tarefa para a API
  async function handleSalvar() {
    setErros([]);
    setSalvando(true);

    try {
      const prioridadeIdNum = paraNumero(idPrioridade) || 2;

      // Busca o objeto de prioridade selecionado na lista recebida por props
      const objPrioridade = prioridades.find(
        (p) => Number(p.id) === Number(prioridadeIdNum),
      );

      // Obtém o nome real da prioridade dinamicamente (ex: 'baixa', 'media', 'alta')
      const prioridadeTexto = objPrioridade
        ? objPrioridade.nome || objPrioridade.descricao
        : "media";

      // Monta o payload no formato exigido pela API
      const payload = {
        texto: texto.trim(),
        coluna: tarefa?.coluna || coluna || "afazer",
        prioridade: String(prioridadeTexto).toLowerCase(),
        idprioridade: prioridadeIdNum,
        usuarioId:
          paraNumero(idUsuario) || (usuario?.id ? Number(usuario.id) : 1),
        projetoId: paraNumero(idProjeto) || 1,
      };

      if (tarefa?.id) {
        payload.id = tarefa.id;
      }

      await onSalvar(payload);

      onFechar(); // Só fecha o modal se a requisição for bem-sucedida
    } catch (e) {
      setErros(mensagensDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  if (!aberto) return null;

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <h2>{tarefa ? "Editar Tarefa" : "Nova Tarefa"}</h2>

        <div className={styles.campo}>
          <label htmlFor="tarefa-texto">Tarefa</label>
          <input
            id="tarefa-texto"
            placeholder="Descreva a tarefa"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="tarefa-responsavel">Responsável</label>
          <select
            id="tarefa-responsavel"
            value={idUsuario}
            onChange={(e) => handleUsuarioChange(e.target.value)}
          >
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="tarefa-projeto">Projeto</label>
          <select
            id="tarefa-projeto"
            value={idProjeto}
            onChange={(e) => setIdProjeto(e.target.value)}
          >
            {projetosDoUsuario.length > 0 ? (
              projetosDoUsuario.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))
            ) : (
              <option value="">
                Nenhum projeto encontrado para este responsável
              </option>
            )}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="tarefa-prioridade">Prioridade</label>
          <select
            id="tarefa-prioridade"
            value={idPrioridade}
            onChange={(e) => setIdPrioridade(e.target.value)}
          >
            {prioridades.length > 0 ? (
              prioridades.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome || p.descricao}
                </option>
              ))
            ) : (
              <>
                <option value={1}>Baixa</option>
                <option value={2}>Média</option>
                <option value={3}>Alta</option>
              </>
            )}
          </select>
        </div>

        {erros.length > 0 && (
          <ul className={styles.erros}>
            {erros.map((mensagem, i) => (
              <li key={i}>{mensagem}</li>
            ))}
          </ul>
        )}

        <div className={styles.botoes}>
          <button type="button" onClick={onFechar}>
            Cancelar
          </button>
          <button type="button" onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalTarefa;
