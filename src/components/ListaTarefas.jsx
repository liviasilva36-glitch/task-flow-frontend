import TarefaItem from './TarefaItem';

function ListaTarefas({ 
  tarefas = [], 
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
          Nenhuma tarefa cadastrada nesta coluna.
        </p>
      )}

      {tarefas.length > 0 && (
        <ul id='lista-tarefas' style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tarefas.map(tarefa => {
            // 1. Identificação flexível do ID da prioridade
            const idPri = Number(
              tarefa.prioridade_id ?? 
              tarefa.prioridadeId ?? 
              tarefa.idprioridade ?? 
              tarefa.idPrioridade ?? 
              tarefa.prioridades?.id ?? 
              (typeof tarefa.prioridade === 'object' ? tarefa.prioridade?.id : null)
            );

            // 2. Cruzamento com o array de prioridades
            const prioridadeObj = prioridades.find(p => Number(p.id) === idPri);

            // 3. Resolução da String final do nome
            let valorPrioridade = 
              tarefa.prioridades?.nome || 
              (typeof tarefa.prioridade === 'object' ? tarefa.prioridade?.nome : null) || 
              prioridadeObj?.nome || 
              prioridadeObj?.descricao ||
              (typeof tarefa.prioridade === 'string' && isNaN(Number(tarefa.prioridade)) ? tarefa.prioridade : null);

            // 4. Mapeamento de fallback
            if (!valorPrioridade && idPri) {
              const mapaIds = {
                1: 'baixa',
                2: 'media',
                3: 'alta'
              };
              valorPrioridade = mapaIds[idPri];
            }

            if (!valorPrioridade) {
              valorPrioridade = 'baixa';
            }

            return (
              <TarefaItem
                key={tarefa.id}
                id={tarefa.id}
                tarefa={tarefa}
                usuarios={usuarios} 
                texto={tarefa.texto || tarefa.descricao}
                cidade={tarefa.cidade}
                prioridade={String(valorPrioridade).toLowerCase()}
                prioridades={tarefa.prioridades}
                prioridade_id={tarefa.prioridade_id}
                coluna={tarefa.coluna}
                onDeletar={() => onDeletar(tarefa.id)}
                onEditar={onEditar ? () => onEditar(tarefa) : undefined}
                onMover={onMover}
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