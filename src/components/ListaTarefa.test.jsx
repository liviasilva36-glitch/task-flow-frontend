import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListaTarefas from './ListaTarefas';

function tarefasExemplo() {
  return [
    {
      id: 1,
      texto: 'Modelar o banco',
      prioridade: 'alta',
      usuarios: { nome: 'Ana Lima' },
    },
    {
      id: 2,
      texto: 'Criar a API',
      prioridade: 'media',
      usuarios: { nome: 'Bruno Melo' },
    },
    {
      id: 3,
      texto: 'Testar o front',
      prioridade: 'baixa',
      usuarios: null,
    },
  ];
}

describe('ListaTarefas', () => {
  test('lista vazia mostra a mensagem e nenhuma lista', () => {
    render(<ListaTarefas tarefas={[]} onDeletar={vi.fn()} />);

    const mensagem = screen.getByText('Nenhuma tarefa cadastrada nesta coluna.');
    expect(mensagem).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('com 3 tarefas, mostra 3 itens', () => {
    render(
      <ListaTarefas tarefas={tarefasExemplo()} onDeletar={vi.fn()} />
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  test('exibe o texto e a prioridade de cada tarefa', () => {
    render(
      <ListaTarefas tarefas={tarefasExemplo()} onDeletar={vi.fn()} />
    );

    expect(screen.getByText('Modelar o banco')).toBeInTheDocument();
    expect(screen.getByText('Criar a API')).toBeInTheDocument();
    expect(screen.getByText('Testar o front')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();
    expect(screen.getByText('Média')).toBeInTheDocument();
    expect(screen.getByText('Baixa')).toBeInTheDocument();
  });

  test('X da segunda tarefa chama o onDeletar com o id 2', async () => {
    const user = userEvent.setup();
    const onDeletar = vi.fn();

    render(
      <ListaTarefas tarefas={tarefasExemplo()} onDeletar={onDeletar} />
    );

    const botoesX = screen.getAllByRole('button', { name: 'X' });
    await user.click(botoesX[1]);

    expect(onDeletar).toHaveBeenCalledWith(2);
  });
});