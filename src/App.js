import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./Menu";
import Waluty from "./Waluty";
import Zloto from "./Zloto";
import Autor from "./Autor";
import SzczegolyWaluty from "./SzczegolyWaluty"; // <--- 1. IMPORTUJEMY

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <Menu />
        <Routes>
          <Route path="/waluty" element={<Waluty />} />
          
          {/* 2. DODAJEMY NOWĄ TRASĘ. :kod to zmienna w adresie */}
          <Route path="/waluty/:kod" element={<SzczegolyWaluty />} />
          
          <Route path="/cena-zlota" element={<Zloto />} />
          <Route path="/autor" element={<Autor />} />
          <Route path="*" element={<Waluty />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;