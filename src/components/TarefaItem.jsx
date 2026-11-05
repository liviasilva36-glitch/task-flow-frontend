import styles from './TarefaItem.module.css';

function TarefaItem({
  id,
  texto, 
  concluida = false, 
  prioridade = 'baixa', 
  prioridades = null,
  prioridade_id = null,
  cidade = "",
  onDeletar, 
  onEditar, 
  onMover          = null,
  colunaAnterior   = null,
  colunaProxima    = null,
}) {

  // Mapeamento de IDs padrão da tabela prioridades
  const mapaPrioridadesPorId = {
    1: 'baixa',
    2: 'media',
    3: 'alta'
  };

  // 1. Extração dinâmica da prioridade
  let valorPrioridade = null;

  const objPrioridade = (typeof prioridade === 'object' ? prioridade : null) || prioridades;
  if (objPrioridade && typeof objPrioridade === 'object') {
    valorPrioridade = objPrioridade.nome || objPrioridade.descricao;
  }

  if (!valorPrioridade && typeof prioridade === 'string' && isNaN(Number(prioridade))) {
    valorPrioridade = prioridade;
  }

  const idNumerico = Number(
    (!isNaN(Number(prioridade)) ? prioridade : null) ?? 
    prioridade_id ?? 
    objPrioridade?.id
  );

  if (!valorPrioridade && idNumerico && mapaPrioridadesPorId[idNumerico]) {
    valorPrioridade = mapaPrioridadesPorId[idNumerico];
  }

  if (!valorPrioridade) {
    valorPrioridade = 'baixa';
  }

  // 2. Normalização para o CSS
  const prioridadeClean = String(valorPrioridade)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const rotulosPrioridade = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa'
  };

  const textoExibicao = rotulosPrioridade[prioridadeClean] || prioridadeClean;

  const classeItem = [
    styles.tarefa,
    concluida ? styles.concluida : '',
    styles[prioridadeClean] || ''
  ].filter(Boolean).join(' ');  
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

      <span className={classePrioridade}>{textoExibicao}</span>
        
      <div className={styles.acoes}>
        {modoKanban && colunaAnterior && (
          <button
            type="button"
            className={styles.btnMover}
            onClick={e => { e.stopPropagation(); onMover(id, colunaAnterior); }}
            title="Mover para coluna anterior"
          >
            ←
          </button>
        )}

        {modoKanban && colunaProxima && (
          <button
            type="button"
            className={styles.btnMover}
            onClick={e => { e.stopPropagation(); onMover(id, colunaProxima); }}
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