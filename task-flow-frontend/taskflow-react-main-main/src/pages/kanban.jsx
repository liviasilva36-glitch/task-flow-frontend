// import { useState, useEffect } from 'react';
import api from '../api'; // 1. Importa a instância do Axios com o interceptor

function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro('');
        
        // 2. Chama a rota /tarefas usando a instância do api (o token é enviado automaticamente pelo interceptor)
        const resposta = await api.get('/tarefas');
        setTarefas(resposta.data);
      } catch (e) {
        setErro('Erro ao carregar tarefas. Verifique a conexão.');
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }

    carregarTarefas();
  }, []);

  if (carregando) return <p>Carregando tarefas...</p>;
  if (erro) return <p className="mensagem-erro">{erro}</p>;

  return (
    <div className="kanban-container">
      <h1>Meu Kanban</h1>
      <div className="kanban-lista">
        {tarefas.map((tarefa) => (
          <div key={tarefa.id} className="tarefa-card">
            <h3>{tarefa.titulo || tarefa.texto}</h3>
            <p>Status: {tarefa.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kanban;