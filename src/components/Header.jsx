import styles from './Header.module.css';

function Header({ titulo, subtitulo }) {
    return (
    <header className={styles.header}>
        <div className={styles.container}>
            <div className={styles.logo}>
                <h1>{titulo}</h1>
                <p>{subtitulo}</p>
            </div>
        </div>
    </header>
    );
}

export default Header;