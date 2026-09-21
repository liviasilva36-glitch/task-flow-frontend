import styles from '../components/Sobre.module.css';

function Sobre() {
  return (
    <main className={styles.container}>
      <h1>Sobre o TaskFlow</h1>

      <p>
        O TaskFlow é um gerenciador de tarefas que permite organizar,
        acompanhar e controlar atividades de forma simples e eficiente.
      </p>

      <h2>Tecnologias usadas</h2>

      <ul>
        <li>React</li>
        <li>Vite</li>
        <li>Axios - teste</li>
        <li>React Router</li>
      </ul>

      <h2>Desenvolvedor</h2>

      <p>
        Desenvolvedora: Ana Livia
        <br />
        Turma: Full stack - Senai CTGás
      </p>
    </main>
  );
}

export default Sobre;