

import TarefaItem from './TarefaItem';

function ListaTarefas({ 
  tarefas, 
  usuarios = [], // 👈 Recebe 'usuarios' no plural
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
          {tarefas.map(tarefa => (
            <TarefaItem
              key={tarefa.id}
              tarefa={tarefa}
              usuarios={usuarios} // 👈 Corrigido: repassa 'usuarios' (no plural)
              texto={tarefa.texto}
              cidade={tarefa.cidade}
              prioridade={tarefa.prioridade}
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
          ))}
        </ul>
      )}
    </section>
  );
}

export default ListaTarefas;