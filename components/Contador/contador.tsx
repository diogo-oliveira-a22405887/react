"use client"

import React, { useState, useEffect } from 'react';

const COUNT_KEY = 'contador_count';
const HISTORY_KEY = 'contador_history';

export default function Contador() {
  const [count, setCount] = useState<number>(0);

  const [history, setHistory] = useState<number[]>([]);

  /*
  () => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  */

  //
  // B. efeitos

  useEffect(() => {
    const saved = localStorage.getItem(COUNT_KEY);
    setCount(Number(saved) ?? 0) 
  },[])

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (!saved){
      setHistory([])
    } else{
        const parsed = JSON.parse(saved);
        setHistory(parsed)
    }
  },[])

  // Guardar no localStorage sempre que o count muda
  useEffect(() => {
    localStorage.setItem(COUNT_KEY, String(count));
  }, [count]);

  // Guardar no localStorage sempre que o history muda
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const getColor = (valor: number) => {
    if (valor >= 0 && valor <= 3) return 'red';
    if (valor >= 4 && valor <= 7) return 'yellow';
    if (valor >= 8 && valor <= 10) return 'green';
    return 'black'; // fallback, não deve acontecer por causa do limite
  };

  const handleClick = () => {
    // novo valor limitado ao intervalo [0, 10]
    const novo = Math.min(count + 1, 10);
    // só atualiza se realmente mudar (para não acrescentar 10 infinitas vezes ao histórico)
    if (novo !== count) {
      setCount(novo);
      setHistory((prev) => [...prev, novo]);
    }
  };

  return (
    <>
      <p style={{ color: getColor(count) }}>
        Clicaste {count} vezes
      </p>

      <button onClick={handleClick}>
        Clica aqui
      </button>

      <p>Histórico:</p>
      <ul>
        {history.map((valor, index) => (
          <li key={index}>{valor}</li>
        ))}
      </ul>
    </>
  );
}
