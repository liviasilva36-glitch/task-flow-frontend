import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useAuth } from "../contexts/AuthContext";

function Sidebar() {

    const { usuario, token, logout } = useAuth();

    const navigate = useNavigate();


    const logado = !!token;


    function handleLogout() {

        logout();

        navigate("/login");
    }


    const linkClass = ({ isActive }) =>
        isActive
            ? `${styles.link} ${styles.ativo}`
            : styles.link;


    return (

        <aside className={styles.sidebar}>

            <div className={styles.logo}>
                <h1>TaskFlow</h1>
            </div>


            <nav className={styles.nav}>

                <NavLink
                    to="/"
                    className={linkClass}
                >
                    Dashboard
                </NavLink>


                <NavLink
                    to="/sobre"
                    className={linkClass}
                >
                    Sobre
                </NavLink>


                <NavLink
                    to="/login"
                    className={linkClass}
                >
                    Login
                </NavLink>

            </nav>


            {logado && (

                <div className={styles.sidebarUsuario}>

                    <span>
                        Olá, {usuario?.nome ?? "Usuário"}
                    </span>


                    <button onClick={handleLogout}>
                        Sair
                    </button>

                </div>

            )}

        </aside>

    );
}


export default Sidebar;