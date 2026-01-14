import React from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <nav style={{ background: "#eee", padding: "10px", marginBottom: "20px" }}>
      <Link to="/waluty" style={{ margin: "0 10px" }}>Waluty (USD)</Link>
      <Link to="/cena-zlota" style={{ margin: "0 10px" }}>Cena Złota</Link>
      <Link to="/autor" style={{ margin: "0 10px" }}>Autor</Link>
    </nav>
  );
};

export default Menu;