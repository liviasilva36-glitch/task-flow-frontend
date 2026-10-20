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
  coluna = 'afazer',
  prioridades = [],
  usuarios = [],
  projetos = []
}) {
  const { usuario } = useAuth();

  const [texto, setTexto] = useState('');
  const [idPrioridade, setIdPrioridade] = useState(2); // 2 = Médio (padrão)
  const [idUsuario, setIdUsuario] = useState("");
  const [idProjeto, setIdProjeto] = useState("");
  const [erros, setErros] = useState([]);
  const [salvando, setSalvando] = useState(false);

  // Preenche os campos ao abrir o modal
  useEffect(() => {
    setErros([]);

    if (tarefa) {
      setTexto(tarefa.texto || "");
      setIdPrioridade(tarefa.idprioridade);
      setIdUsuario(tarefa.usuario_id);
      setIdProjeto(tarefa.projeto_id);
    } else {
      setTexto("");
      setIdPrioridade(2); // 2 = Médio
      setIdUsuario(usuario?.id || usuarios[0]?.id || "");
      setIdProjeto(projetos[0]?.id || "");
    }
  }, [tarefa, aberto, usuario, usuarios, projetos]); 

  // Função para guardar/enviar a tarefa para a API
  async function handleSalvar() {
    setErros([]);
    setSalvando(true);
    
    try {
      await onSalvar({
        ...tarefa,
        id: tarefa?.id,
        texto,
        coluna: tarefa?.coluna || coluna,
        idprioridade: paraNumero(idPrioridade),
        usuario_id: paraNumero(idUsuario),
        projeto_id: paraNumero(idProjeto),
      });

      onFechar(); // Só fecha o modal se a requisição for bem-sucedida
    } catch (e) {
      setErros(mensagensDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  if (!aberto) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
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
            onChange={(e) => setIdUsuario(e.target.value)}
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
            {projetos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="tarefa-prioridade">Prioridade</label>
          <select
            id="tarefa-prioridade"
            value={idPrioridade}
            onChange={(e) => setIdPrioridade(e.target.value)}
          >
            {prioridades.map((p) => (
              <option key={p.id} value={p.id}>
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
          <button type="button" onClick={onFechar}>Cancelar</button>
          <button type="button" onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalTarefa;