import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

const API_URL = "https://task-flow-node.vercel.app";

function Login() {
const [email, setEmail] = useState("admin@taskflow.com");
const [senha, setSenha] = useState("1234");
const [erro, setErro] = useState("");
const [carregando, setCarregando] = useState(false);

const { login } = useAuth();
const navigate = useNavigate();

async function handleLogin(event) {
event.preventDefault();

setErro("");
setCarregando(true);

try {
  const resposta = await fetch(
    API_URL + "/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.trim(),
        senha: senha.trim()
      })
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    setErro(
      dados.erro || "E-mail ou senha inválidos."
    );
    return;
  }

  login(dados.usuario, dados.token);

  navigate("/");
} catch (error) {
  console.error("Erro ao conectar:", error);

  setErro(
    "Não foi possível conectar ao servidor."
  );
} finally {
  setCarregando(false);
}

}

return (
<div className="login-container">
<div className="login-card">

    <h1 className="login-logo">
      TaskFlow
    </h1>

    <p className="login-subtitulo">
      Faça login para continuar
    </p>

    {erro && (
      <p className="login-erro">
        {erro}
      </p>
    )}

    <form onSubmit={handleLogin}>

      <input
        className="login-input"
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        required
      />

      <input
        className="login-input"
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(event) =>
          setSenha(event.target.value)
        }
        required
      />

      <button
        className="login-button"
        type="submit"
        disabled={carregando}
      >
        {carregando ? "Entrando..." : "Entrar"}
      </button>

    </form>

    <p className="login-info">
      Use seu e-mail e senha cadastrados.
    </p>

  </div>
</div>

);
}

export default Login;