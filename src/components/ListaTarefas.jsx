import TarefaItem from './TarefaItem';

function ListaTarefas({ 
  tarefas, 
  prioridades = [],
  usuarios = [],
  onEditar, 
  onDeletar, 
  onMover          = null,
  colunaAnterior   = null,
  colunaProxima    = null,
}) {

  return (
    <section id='lista-section'>
      {tarefas.length === 0 && (
        <p className='msg-vazia'>
          Nenhuma tarefa cadastrada. Adicione uma acima!
        </p>
      )}

      {tarefas.length > 0 && (
        <ul id='lista-tarefas' style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tarefas.map(tarefa => {
            const idPri = Number(tarefa.idprioridade ?? tarefa.prioridade_id ?? tarefa.idPrioridade);

            const prioridadeObj = prioridades.find(
              (p) => Number(p.id) === idPri
            );

            let valorPrioridade = prioridadeObj 
              ? (prioridadeObj.nome || prioridadeObj.descricao) 
              : tarefa.prioridade;

            if (!valorPrioridade) {
              if (idPri === 3) valorPrioridade = 'alta';
              else if (idPri === 1) valorPrioridade = 'baixa';
              else valorPrioridade = 'media';
            }

            return (
              <TarefaItem
                key={tarefa.id}
                tarefa={tarefa}
                usuarios={usuarios} 
                texto={tarefa.texto || tarefa.descricao}
                cidade={tarefa.cidade}
                prioridade={String(valorPrioridade).toLowerCase()}
                coluna={tarefa.coluna}
                onDeletar={() => onDeletar(tarefa.id)}
                onEditar={onEditar ? () => onEditar(tarefa) : undefined}
                onMover={
                  onMover
                    ? (novaColuna) => onMover(tarefa.id, novaColuna)
                    : null
                }
                colunaAnterior={colunaAnterior}
                colunaProxima={colunaProxima}        
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default ListaTarefas;