
import { Route, Routes } from "react-router-dom";
import "./App.css";

import Sobre from "./pages/Sobre";
import Login from "./pages/Login";
import TarefaV1 from "./components/tarefaV1";
import Sidebar from "./components/Sidebar";
import RotaPrivada from "./components/RotaPrivada";

function App() {
  return (
    <div className="app-layout">

      <Sidebar />

      <main className="app-conteudo">
        <Routes>

          <Route
            path="/"
            element={
              <RotaPrivada>
                <TarefaV1 />
              </RotaPrivada>
            }
          />

          <Route path="/sobre" element={<Sobre />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="*"
            element={<h1>Página não encontrada</h1>}
          />

        </Routes>
      </main>

    </div>
  );
}

export default App;
