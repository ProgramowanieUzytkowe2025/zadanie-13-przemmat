import React, { useState, useEffect } from "react";

const Zloto = () => {
  const [notowania, setNotowania] = useState([]);
  const [ile, setIle] = useState(10);

  const pobierzDane = (liczba) => {
    fetch(`https://api.nbp.pl/api/cenyzlota/last/${liczba}/?format=json`)
      .then((res) => res.json())
      .then((data) => setNotowania(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    pobierzDane(10);
  }, []);

  const zatwierdz = (e) => {
    e.preventDefault();
    if (ile > 0) pobierzDane(ile);
  };

  return (
    <div>
      <h2>Cena złota</h2>
      <form onSubmit={zatwierdz} style={{ marginBottom: "20px" }}>
        <label>Liczba notowań: </label>
        <input 
          type="number" value={ile} onChange={(e) => setIle(e.target.value)} 
          min="1" max="200"
        />
        <button type="submit">Pobierz</button>
      </form>

      <table border="1">
        <thead>
          <tr><th>Data</th><th>Cena 1g (PLN)</th></tr>
        </thead>
        <tbody>
          {/* ZMIANA TUTAJ: [...notowania].reverse() odwraca tablicę */}
          {[...notowania].reverse().map((wiersz) => (
            <tr key={wiersz.data}>
              <td>{wiersz.data}</td>
              <td>{wiersz.cena} zł</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Zloto;