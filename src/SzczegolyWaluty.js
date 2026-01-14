import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// Importujemy komponenty wykresu
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SzczegolyWaluty = () => {
  const { kod } = useParams(); 
  const [dane, setDane] = useState(null);

  useEffect(() => {
    // ZMIANA: Pobieramy "last/30" - czyli 30 ostatnich notowań
    fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${kod}/last/30/?format=json`)
      .then((res) => res.json())
      .then((data) => setDane(data))
      .catch((err) => console.error(err));
  }, [kod]);

  if (!dane) return <p>Ładowanie danych...</p>;

  return (
    <div>
      <h2>Historia waluty: {dane.currency} ({dane.code})</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <Link to="/waluty">
          <button>Wróć do listy</button>
        </Link>
      </div>

      <h3>Wykres z ostatnich 30 dni</h3>
      
      {/* Kontener na wykres - musi mieć określoną wysokość */}
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dane.rates} // Dane z API (tablica rates)
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="effectiveDate" /> {/* Oś X: Data */}
            {/* Oś Y: domain auto sprawia, że wykres nie jest płaski */}
            <YAxis domain={['auto', 'auto']} /> 
            <Tooltip /> {/* Dymek po najechaniu myszką */}
            <Line 
              type="monotone" 
              dataKey="mid" // Oś Y: Wartość średnia kursu
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SzczegolyWaluty; 