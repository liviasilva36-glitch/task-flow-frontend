import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BASE_API || "https://task-flow-node.vercel.app",
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