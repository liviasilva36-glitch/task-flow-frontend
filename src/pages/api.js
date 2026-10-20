
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // Ou a URL da tua API
});

// Apenas UMA declaração desta função no ficheiro todo:
export function mensagensDeErro(erro) {
  const dados = erro.response?.data?.erro;

  if (!erro.response) {
    return ["Sem resposta do servidor. Verifique a ligação ou a API."];
  }

  if (Array.isArray(dados)) {
    return dados;
  }

  if (typeof dados === "string") {
    return [dados];
  }

  return ["Ocorreu um erro inesperado."];
}

export default api;

