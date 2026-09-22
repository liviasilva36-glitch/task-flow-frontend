import styles from './TarefaItem.module.css'

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
    }){

    const classeItem = (concluida
    ? styles.tarefa + ' ' + styles.concluida
    : styles.tarefa) + ' ' + styles[prioridade];

    const classeTexto = concluida 
        ? styles.textoTarefa + ' ' + styles['texto-tarefa'] 
        : styles.textoTarefa

    const classePrioridade = 
        styles ['badge-prioridade'] + ' ' + styles['badge-' + prioridade];

    const modoKanban = onMover !== null;

    return(
    <li className={classeItem} onDoubleClick={onEditar}>
      <dir className={styles.conteudo}>
        <span className={classeTexto}>{texto}</span>
        {cidade && <span className={styles.cidade}>{cidade}</span>}
      </dir>
      <span className={classePrioridade}>{prioridade}</span>
       
      <div className={styles.acoes}>
        {modoKanban && colunaAnterior && (
          <button
            className={styles.btnMover}
            onClick={e => { e.stopPropagation(); onMover(colunaAnterior);}}
            title="Mover para coluna anterior"
          >
            ←
          </button>
        )}

        {modoKanban && colunaProxima && (
          <button
            className={styles.btnMover}
            onClick={e => { e.stopPropagation(); onMover(colunaProxima);}}
            title="Mover para próxima coluna"
          >
            →
          </button>
        )}

        <button className={styles.btnDeletar} onClick={e => { e.stopPropagation(); onDeletar();}}>
          X
        </button>

      </div>
    
    </li>
    );
}

export default TarefaItem;