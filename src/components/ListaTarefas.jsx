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

            // 1. Tenta buscar na lista de prioridades recebida da API
            const prioridadeObj = prioridades.find(
              (p) => Number(p.id) === idPri
            );

            // 2. Determina a string correta da prioridade (ex: 'alta', 'baixa', 'media')
            let valorPrioridade = prioridadeObj 
              ? (prioridadeObj.nome || prioridadeObj.descricao)
              : null;

            // 3. Fallbacks de resgate caso a prop 'prioridades' não venha preenchida
            if (!valorPrioridade) {
              if (typeof tarefa.prioridade === 'string' && tarefa.prioridade.trim() !== '') {
                valorPrioridade = tarefa.prioridade;
              } else if (idPri === 1) {
                valorPrioridade = 'baixa';
              } else if (idPri === 3) {
                valorPrioridade = 'alta';
              } else {
                valorPrioridade = 'media';
              }
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