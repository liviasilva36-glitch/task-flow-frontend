import { useEffect, useState } from "react";
import { mensagensDeErro } from "../pages/api.js";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ModalTarefa.module.css";

function paraNumero(valor) {
  return valor !== null && valor !== undefined && valor !== "" ? Number(valor) : null;
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

  const projetosDoUsuario = projetos.filter(
    (p) => Number(p.usuario_id || p.usuarioId) === Number(idUsuario)
  );

  const listaPrioridades = prioridades.length > 0 ? prioridades : [
    { id: 1, nome: "baixa", descricao: "Baixa" },
    { id: 2, nome: "media", descricao: "Média" },
    { id: 3, nome: "alta", descricao: "Alta" }
  ];

  useEffect(() => {
    if (!aberto) return;

    setErros([]);

    if (tarefa) {
      setTexto(tarefa.texto || tarefa.descricao || "");
      
      const idPri = tarefa.idprioridade ?? tarefa.idPrioridade ?? tarefa.prioridade_id ?? 2;
      setIdPrioridade(String(idPri));

      const usrId = tarefa.usuarioId ?? tarefa.usuario_id ?? (usuario?.id || usuarios[0]?.id || "");
      setIdUsuario(String(usrId));

      const projId = tarefa.projetoId ?? tarefa.projeto_id ?? "";
      setIdProjeto(String(projId));
    } else {
      const usuarioPadrao = usuario?.id || usuarios[0]?.id || "";
      const prioridadePadrao = "2";

      setTexto("");
      setIdPrioridade(prioridadePadrao);
      setIdUsuario(String(usuarioPadrao));

      const projsIniciais = projetos.filter(
        (p) => Number(p.usuario_id || p.usuarioId) === Number(usuarioPadrao)
      );

      const projInicialId = projsIniciais[0]?.id || projetos[0]?.id || "1";
      setIdProjeto(String(projInicialId));
    }
  }, [aberto, tarefa, prioridades, usuario, usuarios, projetos]);

  function handleUsuarioChange(novoIdUsuario) {
    setIdUsuario(novoIdUsuario);
    const projetosFiltrados = projetos.filter(
      (p) => Number(p.usuario_id || p.usuarioId) === Number(novoIdUsuario)
    );

    const novoProjId = projetosFiltrados[0]?.id || projetos[0]?.id || "1";
    setIdProjeto(String(novoProjId));
  }

  async function handleSalvar() {
    setErros([]);
    
    if (!texto.trim()) {
      setErros(["O texto da tarefa não pode estar vazio."]);
      return;
    }

    setSalvando(true);

    try {
      const prioridadeIdNum = Number(idPrioridade) || 2;

      const objPrioridade = listaPrioridades.find(
        (p) => Number(p.id || p.idprioridade) === prioridadeIdNum
      );

      let prioridadeTexto = objPrioridade
        ? objPrioridade.nome || objPrioridade.descricao
        : null;

      if (!prioridadeTexto) {
        if (prioridadeIdNum === 1) prioridadeTexto = "baixa";
        else if (prioridadeIdNum === 3) prioridadeTexto = "alta";
        else prioridadeTexto = "media";
      }

      const textoPrioridadeBaixa = String(prioridadeTexto).toLowerCase();

      const projetoIdCalculado = paraNumero(idProjeto) || 
        (projetosDoUsuario.length > 0 ? Number(projetosDoUsuario[0].id) : (projetos[0]?.id ? Number(projetos[0].id) : 1));

      const payload = {
        texto: texto.trim(),
        coluna: tarefa?.coluna || coluna || "afazer",
        prioridade: textoPrioridadeBaixa,
        idPrioridade: prioridadeIdNum,
        idprioridade: prioridadeIdNum,
        prioridade_id: prioridadeIdNum,
        id_prioridade: prioridadeIdNum,
        usuarioId: paraNumero(idUsuario) || (usuario?.id ? Number(usuario.id) : 1),
        usuario_id: paraNumero(idUsuario) || (usuario?.id ? Number(usuario.id) : 1),
        projetoId: projetoIdCalculado,
        projeto_id: projetoIdCalculado,
      };

      if (tarefa?.id) {
        payload.id = tarefa.id;
      }

      await onSalvar(payload);
      onFechar();
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
              <option key={u.id} value={String(u.id)}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="tarefa-projeto">Projeto</label>
          <select
            id="tarefa-projeto"
            value={String(idProjeto)}
            onChange={(e) => setIdProjeto(e.target.value)}
          >
            {projetosDoUsuario.length > 0 ? (
              projetosDoUsuario.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.nome}
                </option>
              ))
            ) : projetos.length > 0 ? (
              projetos.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.nome}
                </option>
              ))
            ) : (
              <option value="1">Projeto Padrão</option>
            )}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="tarefa-prioridade">Prioridade</label>
          <select
            id="tarefa-prioridade"
            value={String(idPrioridade)}
            onChange={(e) => setIdPrioridade(e.target.value)}
          >
            {listaPrioridades.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.descricao || p.nome}
              </option>
            ))}
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