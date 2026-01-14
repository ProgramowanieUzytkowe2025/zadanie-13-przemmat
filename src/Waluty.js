import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // <--- Musimy to zaimportować!

const Waluty = () => {
  const [listaWalut, setListaWalut] = useState([]);
  const [wybranaWaluta, setWybranaWaluta] = useState("usd");
  const [wybranaData, setWybranaData] = useState(new Date().toISOString().split("T")[0]);
  const [dataZapytania, setDataZapytania] = useState(null);
  const [wynik, setWynik] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://api.nbp.pl/api/exchangerates/tables/a/?format=json")
      .then((res) => res.json())
      .then((data) => setListaWalut(data[0].rates))
      .catch((err) => console.error(err));
  }, []);

  const odejmijDzien = (dataStr) => {
    const dateObj = new Date(dataStr);
    dateObj.setDate(dateObj.getDate() - 1);
    return dateObj.toISOString().split("T")[0];
  };

  const pobierzKurs = (waluta, data) => {
    setLoading(true);
    fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${waluta}/${data}/?format=json`)
      .then((res) => {
        if (res.status === 404) {
          const nowaData = odejmijDzien(data);
          return pobierzKurs(waluta, nowaData);
        }
        if (!res.ok) throw new Error("Błąd sieci");
        return res.json();
      })
      .then((data) => {
        if (data && data.code) {
          setWynik(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const zatwierdz = (e) => {
    e.preventDefault();
    setWynik(null);
    setDataZapytania(wybranaData);
    pobierzKurs(wybranaWaluta, wybranaData);
  };

  return (
    <div>
      <h2>Sprawdź kurs waluty</h2>
      
      <form onSubmit={zatwierdz} style={{ marginBottom: "20px", background: "#f9f9f9", padding: "15px" }}>
        <label>
          Waluta: 
          <select 
            value={wybranaWaluta} 
            onChange={(e) => setWybranaWaluta(e.target.value)}
            style={{ margin: "0 10px" }}
          >
            {listaWalut.map((waluta) => (
              <option key={waluta.code} value={waluta.code.toLowerCase()}>
                {waluta.code} - {waluta.currency}
              </option>
            ))}
          </select>
        </label>

        {/* NOWOŚĆ: Przycisk Przejdź do szczegółów */}
        <Link to={`/waluty/${wybranaWaluta}`}>
          <button type="button" style={{ marginRight: "20px" }}>
            Przejdź (Szczegóły)
          </button>
        </Link>
        {/* Koniec nowości */}

        <label>
          Data: 
          <input 
            type="date" 
            value={wybranaData} 
            onChange={(e) => setWybranaData(e.target.value)}
            style={{ margin: "0 10px" }}
          />
        </label>

        <button type="submit">Sprawdź kurs</button>
      </form>

      {loading && <p>Szukam danych...</p>}
      
      {wynik && (
        <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
          <h3>Wynik dla waluty: {wynik.currency} ({wynik.code})</h3>
          <p>Data w tabeli NBP: <strong>{wynik.rates[0].effectiveDate}</strong></p>
          <p>Kurs: <strong>{wynik.rates[0].mid} PLN</strong></p>
          
          {dataZapytania && wynik.rates[0].effectiveDate !== dataZapytania && (
            <p style={{ color: "red", fontSize: "0.9em" }}>
              * Wybrana data ({dataZapytania}) była dniem wolnym. 
              Pobrano kurs z najbliższego dnia roboczego.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Waluty;