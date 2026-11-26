import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Kanban from './kanban';
import { AuthProvider } from '../contexts/AuthContext';
import api from './api';

// Ignora o CSS ausente durante o teste
vi.mock('./Kanban.css', () => ({}));

// Troca o ./api inteiro por um de mentira
vi.mock('./api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  mensagensDeErro: vi.fn(() => ['Erro ao carregar tarefas']),
}));

const respostas = {
  '/prioridades': [
    { id: 1, descricao: 'Alto' },
    { id: 2, descricao: 'Médio' },
  ],
  '/tarefas': [
    {
      id: 1,
      texto: 'Modelar o banco',
      coluna: 'afazer',
      prioridade: 'Alto',
      prioridade_cor: '#EF4444',
    },
    {
      id: 2,
      texto: 'Criar a API',
      coluna: 'andamento',
      prioridade: 'Médio',
      prioridade_cor: '#F59E0B',
    },
  ],
  '/usuarios': [{ id: 1, nome: 'Ana Lima' }],
  '/projetos': [{ id: 10, nome: 'TaskFlow' }],
};

function desenharKanban() {
  render(
    <AuthProvider>
      <Kanban />
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockImplementation((url) => Promise.resolve({ data: respostas[url] }));
});

describe('Kanban', () => {
  // Teste 1
  test('mostra Carregando enquanto a API não responde', () => {
    desenharKanban();
    expect(screen.getByText('Carregando Kanban...')).toBeInTheDocument();
  });

  // Teste 2
  test('depois da resposta, as tarefas aparecem', async () => {
    desenharKanban();
    expect(await screen.findByText('Modelar o banco')).toBeInTheDocument();
    expect(screen.getByText('Criar a API')).toBeInTheDocument();
    expect(screen.queryByText('Carregando Kanban...')).not.toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/tarefas');
  });

  // Teste 3
  test('se a API falha, dispara o alerta de erro', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    api.get.mockRejectedValue(new Error('Network Error'));

    desenharKanban();

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Erro ao carregar tarefas');
    });
  });

  // Exercício 4
  test('clicar no X da primeira tarefa chama api.delete e a tarefa some', async () => {
    const user = userEvent.setup();
    api.delete.mockResolvedValue();
    desenharKanban();

    await screen.findByText('Modelar o banco');

    const botoesExcluir = screen.getAllByRole('button', { name: /×|x/i });
    await user.click(botoesExcluir[0]);

    expect(api.delete).toHaveBeenCalledWith('/tarefas/1');
    expect(screen.queryByText('Modelar o banco')).not.toBeInTheDocument();
  });

  // Exercício 5 (Desafio)
  test('clicar na seta de Modelar o banco chama api.put com coluna andamento', async () => {
    const user = userEvent.setup();
    api.put.mockResolvedValue({ data: {} });
    desenharKanban();

    await screen.findByText('Modelar o banco');

    const botoesAvancar = screen.getAllByRole('button', { name: '→' });
    await user.click(botoesAvancar[0]);

    expect(api.put).toHaveBeenCalledWith('/tarefas/1', {
      coluna: 'andamento',
    });
  });
});