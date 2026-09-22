import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

// Usa a variável do Vercel quando existir.
// Se não existir, usa o backend local.
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

function Login() {
  const [email, setEmail] = useState("admin@taskflow.com");
  const [senha, setSenha] = useState("1234");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      console.log("API_URL:", API_URL);
      console.log(
        "URL DO LOGIN:",
        `${API_URL}/auth/login`
      );

      const resposta = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            senha: senha.trim(),
          }),
        }
      );

      console.log(
        "STATUS DA RESPOSTA:",
        resposta.status
      );

      const texto = await resposta.text();

      console.log(
        "RESPOSTA DO SERVIDOR:",
        texto
      );

      let dados = {};

      if (texto) {
        try {
          dados = JSON.parse(texto);
        } catch (error) {
          console.error(
            "Resposta não é JSON válido:",
            error
          );
        }
      }

      if (!resposta.ok) {
        setErro(
          dados.erro ||
            `Erro no servidor: ${resposta.status}`
        );
        return;
      }

      console.log(
        "DADOS DO LOGIN:",
        dados
      );

      login(
        dados.usuario,
        dados.token
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Erro ao conectar:",
        error
      );

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
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            className="login-input"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
            required
          />

          <button
            className="login-button"
            type="submit"
            disabled={carregando}
          >
            {carregando
              ? "Entrando..."
              : "Entrar"}
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