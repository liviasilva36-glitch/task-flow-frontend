import styles from './TarefaItem.module.css';

function TarefaItem({
  texto, 
  concluida = false, 
  prioridade = 'media', 
  cidade = "",
  onDeletar, 
  onEditar, 
  onMover          = null,
  colunaAnterior   = null,
  colunaProxima    = null,
}) {

  // Normaliza o nome da prioridade para evitar erros de leitura no CSS
  const valorPrioridade = typeof prioridade === 'object' 
  ? (prioridade?.nome || prioridade?.descricao || 'media')
  : (prioridade || 'media');

  // Define as classes do container li
  const prioridadeClean = String(valorPrioridade)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();


    const rótulosPrioridade = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa'
  };

  const textoExibicao = rótulosPrioridade[prioridadeClean] || prioridadeClean;


  // Define as classes do texto principal
  const classeItem = [
    styles.tarefa,
    concluida ? styles.concluida : '',
    styles[prioridadeClean] || ''
  ].filter(Boolean).join(' ');

  // Define as classes da badge de prioridade
const classeTexto = concluida 
    ? `${styles.textoTarefa} ${styles['texto-tarefa'] || ''}`.trim()
    : styles.textoTarefa;

     const classePrioridade = `${styles['badge-prioridade'] || ''} ${styles['badge-' + prioridadeClean] || ''}`.trim();

    const modoKanban = onMover !== null;

  return (
    <li className={classeItem} onDoubleClick={onEditar}>
      <div className={styles.conteudo}>
        <span className={classeTexto}>{texto}</span>
        {cidade && <span className={styles.cidade}>{cidade}</span>}
      </div>

      <span className={classePrioridade}>{prioridadeClean}</span>
       
      <div className={styles.acoes}>
        {modoKanban && colunaAnterior && (
          <button
            type="button"
            className={styles.btnMover}
            onClick={e => { e.stopPropagation(); onMover(colunaAnterior); }}
            title="Mover para coluna anterior"
          >
            ←
          </button>
        )}

        {modoKanban && colunaProxima && (
          <button
            type="button"
            className={styles.btnMover}
            onClick={e => { e.stopPropagation(); onMover(colunaProxima); }}
            title="Mover para próxima coluna"
          >
            →
          </button>
        )}

        <button 
          type="button"
          className={styles.btnDeletar} 
          onClick={e => { e.stopPropagation(); onDeletar(); }}
          title="Excluir tarefa"
        >
          X
        </button>
      </div>
    </li>
  );
}

export default TarefaItem;