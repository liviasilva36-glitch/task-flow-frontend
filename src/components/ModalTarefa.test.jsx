import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalTarefa from './ModalTarefa';
import { AuthProvider } from '../contexts/AuthContext';

const prioridades = [
  { id: 1, descricao: 'Alto' },
  { id: 2, descricao: 'Médio' },
  { id: 3, descricao: 'Baixo' },
];

const usuarios = [
  { id: 1, nome: 'Ana Lima' },
  { id: 2, nome: 'Bruno Melo' },
];

const projetos = [
  { id: 10, nome: 'TaskFlow' },
  { id: 20, nome: 'Site da Escola' },
];

function abrirModal(props = {}) {
  render(
    <AuthProvider>
      <ModalTarefa
        aberto={true}
        onFechar={vi.fn()}
        onSalvar={vi.fn()}
        prioridades={prioridades}
        usuarios={usuarios}
        projetos={projetos}
        {...props}
      />
    </AuthProvider>
  );
}

describe('ModalTarefa', () => {
  // Teste 1
  test('fechado, não mostra nada', () => {
    abrirModal({ aberto: false });
    expect(screen.queryByText('Nova Tarefa')).not.toBeInTheDocument();
  });

  // Teste 2
  test('aberto para criar, mostra o título e os campos', () => {
    abrirModal();
    expect(screen.getByRole('heading', { name: 'Nova Tarefa' })).toBeInTheDocument();
    expect(screen.getByLabelText('Tarefa')).toHaveValue('');
    expect(screen.getByLabelText('Responsável')).toHaveValue('1');
    expect(screen.getByLabelText('Projeto')).toHaveValue('');
    expect(screen.getByLabelText('Prioridade')).toHaveValue('2');
  });

  // Teste 3
  test('aberto para editar, vem preenchido', () => {
    const tarefa = {
      id: 7,
      texto: 'Revisar a API',
      coluna: 'andamento',
      idprioridade: 1,
      usuario_id: 2,
      projeto_id: 20,
    };
    abrirModal({ tarefa });
    expect(screen.getByRole('heading', { name: 'Editar Tarefa' })).toBeInTheDocument();
    expect(screen.getByLabelText('Tarefa')).toHaveValue('Revisar a API');
    expect(screen.getByLabelText('Responsável')).toHaveValue('2');
  });

  // Teste 4
  test('o que a pessoa digita aparece no campo', async () => {
    const user = userEvent.setup();
    abrirModal();
    const campo = screen.getByLabelText('Tarefa');
    await user.type(campo, 'Estudar mocks');
    expect(campo).toHaveValue('Estudar mocks');
  });

  // Teste 5
  test('Cancelar chama onFechar', async () => {
    const user = userEvent.setup();
    const onFechar = vi.fn();
    abrirModal({ onFechar });

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onFechar).toHaveBeenCalledTimes(1);
  });

  // Teste 6
  test('Salvar envia os dados e fecha o modal', async () => {
    const user = userEvent.setup();
    const onSalvar = vi.fn().mockResolvedValue();
    const onFechar = vi.fn();
    abrirModal({ onSalvar, onFechar, coluna: 'afazer' });

    await user.type(screen.getByLabelText('Tarefa'), 'Estudar mocks');
    await user.selectOptions(screen.getByLabelText('Prioridade'), 'Alto');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onSalvar).toHaveBeenCalledWith(
      expect.objectContaining({
        texto: 'Estudar mocks',
        coluna: 'afazer',
        idprioridade: 1,
        usuario_id: 1,
      })
    );
    expect(onFechar).toHaveBeenCalledTimes(1);
  });

  // Teste 7
  test('a API recusa: mostra os erros e não fecha', async () => {
    const user = userEvent.setup();
    const erro400 = {
      response: { data: { erro: { detalhes: ['texto é obrigatório'] } } },
    };
    const onSalvar = vi.fn().mockRejectedValue(erro400);
    const onFechar = vi.fn();
    abrirModal({ onSalvar, onFechar });

    await user.type(screen.getByLabelText('Tarefa'), 'Teste erro API');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Ocorreu um erro inesperado.')).toBeInTheDocument();
    expect(onFechar).not.toHaveBeenCalled();
  });

  // Exercício 1
  test('enquanto salva, o botão vira Salvando... e fica desabilitado', async () => {
    const user = userEvent.setup();
    const onSalvar = vi.fn(() => new Promise(() => {}));
    abrirModal({ onSalvar });

    await user.type(screen.getByLabelText('Tarefa'), 'Tarefa demorada');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    const botao = screen.getByRole('button', { name: 'Salvando...' });
    expect(botao).toBeInTheDocument();
    expect(botao).toBeDisabled();
  });

  // Exercício 2
  test('ao editar, onSalvar recebe o id e a coluna da tarefa', async () => {
    const user = userEvent.setup();
    const onSalvar = vi.fn().mockResolvedValue();
    const tarefa = {
      id: 7,
      texto: 'Revisar a API',
      coluna: 'andamento',
      idprioridade: 1,
      usuario_id: 2,
      projeto_id: 20,
    };
    abrirModal({ onSalvar, tarefa });

    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onSalvar).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 7,
        coluna: 'andamento',
      })
    );
  });

  // Exercício 3
  test('escolher Bruno Melo como responsável envia usuario_id 2', async () => {
    const user = userEvent.setup();
    const onSalvar = vi.fn().mockResolvedValue();
    abrirModal({ onSalvar });

    await user.type(screen.getByLabelText('Tarefa'), 'Tarefa do Bruno');
    await user.selectOptions(screen.getByLabelText('Responsável'), 'Bruno Melo');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onSalvar).toHaveBeenCalledWith(
      expect.objectContaining({
        usuario_id: 2,
      })
    );
  });
});