import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const [usuario, setUsuario] = useState(
    () => {
      const usuarioSalvo =
        localStorage.getItem("usuario");

      return usuarioSalvo
        ? JSON.parse(usuarioSalvo)
        : null;
    }
  );


  function login(dadosUsuario, tokenRecebido) {

    setToken(tokenRecebido);
    setUsuario(dadosUsuario);

    localStorage.setItem(
      "token",
      tokenRecebido
    );

    localStorage.setItem(
      "usuario",
      JSON.stringify(dadosUsuario)
    );
  }


  function logout() {

    setToken(null);
    setUsuario(null);

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }


  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser usado dentro do AuthProvider"
    );
  }

  return context;
}