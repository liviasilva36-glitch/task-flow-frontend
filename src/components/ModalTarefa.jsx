
import { useEffect, useState } from "react";
import { mensagensDeErro } from "../pages/api.js";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ModalTarefa.module.css";

// Converte valores para números inteiros positivos.
// Se o valor estiver vazio ou inválido, retorna null.
function paraNumero(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const numero = Number(valor);

  return Number.isInteger(numero) && numero > 0 ? numero : null;
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
  const [idPrioridade, setIdPrioridade] = useState("2");
  const [idUsuario, setIdUsuario] = useState("");
  const [idProjeto, setIdProjeto] = useState("");
  const [erros, setErros] = useState([]);
  const [salvando, setSalvando] = useState(false);

  // Prioridades disponíveis
  const listaPrioridades =
    prioridades.length > 0
      ? prioridades
      : [
          { id: 1, nome: "baixa", descricao: "Baixa" },
          { id: 2, nome: "media", descricao: "Média" },
          { id: 3, nome: "alta", descricao: "Alta" },
        ];

  // Projetos pertencentes ao usuário selecionado
  const projetosDoUsuario = projetos.filter(
    (p) =>
      Number(p.usuario_id ?? p.usuarioId) === Number(idUsuario)
  );

  // Ao abrir o modal, carrega os dados
  useEffect(() => {
    if (!aberto) return;

    setErros([]);

    if (tarefa) {
      // Edição de tarefa existente
      setTexto(tarefa.texto || tarefa.descricao || "");

      const idPri =
        tarefa.prioridadeId ??
        tarefa.idprioridade ??
        tarefa.idPrioridade ??
        tarefa.prioridade_id ??
        2;

      setIdPrioridade(String(idPri));

      const usrId =
        tarefa.usuarioId ??
        tarefa.usuario_id ??
        usuario?.id ??
        usuarios[0]?.id ??
        "";

      setIdUsuario(String(usrId));

      const projId =
        tarefa.projetoId ??
        tarefa.projeto_id ??
        "";

      setIdProjeto(String(projId));
    } else {
      // Criação de nova tarefa
      const usuarioPadrao =
        usuario?.id ?? usuarios[0]?.id ?? "";

      setTexto("");
      setIdPrioridade("2");
      setIdUsuario(String(usuarioPadrao));

      const projetosIniciais = projetos.filter(
        (p) =>
          Number(p.usuario_id ?? p.usuarioId) ===
          Number(usuarioPadrao)
      );

      // Não inventa um ID quando o usuário não possui projeto
      const projetoInicial = projetosIniciais[0]?.id ?? "";

      setIdProjeto(String(projetoInicial));
    }
  }, [aberto, tarefa, prioridades, usuario, usuarios, projetos]);

  // Quando o responsável muda, atualiza os projetos disponíveis
  function handleUsuarioChange(novoIdUsuario) {
    setIdUsuario(novoIdUsuario);

    const projetosFiltrados = projetos.filter(
      (p) =>
        Number(p.usuario_id ?? p.usuarioId) ===
        Number(novoIdUsuario)
    );

    const novoProjetoId = projetosFiltrados[0]?.id ?? "";

    setIdProjeto(String(novoProjetoId));
  }

  // Salvar tarefa
  async function handleSalvar() {
    setErros([]);

    if (!texto.trim()) {
      setErros(["O texto da tarefa não pode estar vazio."]);
      return;
    }

    const usuarioIdCalculado = paraNumero(idUsuario);

    if (!usuarioIdCalculado) {
      setErros(["Selecione um responsável válido para a tarefa."]);
      return;
    }

    setSalvando(true);

    try {
      const prioridadeIdNum = paraNumero(idPrioridade) || 2;

      const objPrioridade = listaPrioridades.find(
        (p) =>
          Number(p.id ?? p.idprioridade) === prioridadeIdNum
      );

      let prioridadeTexto = objPrioridade
        ? objPrioridade.nome || objPrioridade.descricao
        : null;

      if (!prioridadeTexto) {
        if (prioridadeIdNum === 1) {
          prioridadeTexto = "baixa";
        } else if (prioridadeIdNum === 3) {
          prioridadeTexto = "alta";
        } else {
          prioridadeTexto = "media";
        }
      }

      const textoPrioridade = String(prioridadeTexto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      // Projeto selecionado. Pode ser null se não houver projeto.
      const projetoIdCalculado = paraNumero(idProjeto);

      const textoFinal = texto.trim();
      const colunaFinal = tarefa?.coluna || coluna || "afazer";

      const payload = {
        texto: textoFinal,
        descricao: textoFinal,

        coluna: colunaFinal,
        status: colunaFinal,
        situacao: colunaFinal,

        prioridade: textoPrioridade,
        idPrioridade: prioridadeIdNum,
        idprioridade: prioridadeIdNum,
        prioridade_id: prioridadeIdNum,
        id_prioridade: prioridadeIdNum,

        usuarioId: usuarioIdCalculado,
        usuario_id: usuarioIdCalculado,
      };

      // Só envia o projeto quando existe um ID válido.
      // Na edição, permite limpar um projeto anteriormente associado.
      if (projetoIdCalculado) {
        payload.projetoId = projetoIdCalculado;
        payload.projeto_id = projetoIdCalculado;
      } else if (tarefa?.id) {
        payload.projetoId = null;
        payload.projeto_id = null;
      }

      if (tarefa?.id) {
        payload.id = tarefa.id;                         
      }

      await onSalvar(payload);

      onFechar();
    } catch (e) {
      if (typeof mensagensDeErro === "function") {
        setErros(mensagensDeErro(e));
      } else {
        setErros([
          e.response?.data?.message ||
            e.response?.data?.erro ||
            "Erro ao salvar a tarefa.",
        ]);
      }
    } finally {
      setSalvando(false);
    }
  }

  if (!aberto) return null;

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <h2>{tarefa ? "Editar Tarefa" : "Nova Tarefa"}</h2>

        {/* Descrição da tarefa */}
        <div className={styles.campo}>
          <label htmlFor="tarefa-texto">Tarefa</label>

          <input
            id="tarefa-texto"
            placeholder="Descreva a tarefa"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>

        {/* Responsável */}
        <div className={styles.campo}>
          <label htmlFor="tarefa-responsavel">
            Responsável
          </label>

          <select
            id="tarefa-responsavel"
            value={idUsuario}
            onChange={(e) =>
              handleUsuarioChange(e.target.value)
            }
          >
            <option value="">Selecione um responsável</option>

            {usuarios.map((u) => (
              <option key={u.id} value={String(u.id)}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Projeto */}
        <div className={styles.campo}>
          <label htmlFor="tarefa-projeto">Projeto</label>

          <select
            id="tarefa-projeto"
            value={String(idProjeto)}
            onChange={(e) => setIdProjeto(e.target.value)}
          >
            <option value="">
              {projetosDoUsuario.length > 0
                ? "Selecione um projeto"
                : "Nenhum projeto associado"}
            </option>

            {projetosDoUsuario.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Prioridade */}
        <div className={styles.campo}>
          <label htmlFor="tarefa-prioridade">
            Prioridade
          </label>

          <select
            id="tarefa-prioridade"
            value={String(idPrioridade)}
            onChange={(e) => setIdPrioridade(e.target.value)}
          >
            {listaPrioridades.map((p) => (
              <option
                key={p.id ?? p.idprioridade}
                value={String(p.id ?? p.idprioridade)}
              >
                {p.descricao || p.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Mensagens de erro */}
        {erros.length > 0 && (
          <ul className={styles.erros}>
            {erros.map((mensagem, i) => (
              <li key={i}>{mensagem}</li>
            ))}
          </ul>
        )}

        {/* Botões */}
        <div className={styles.botoes}>
          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSalvar}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalTarefa;
