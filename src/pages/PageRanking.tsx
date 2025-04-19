import React, { useEffect, useState } from 'react';
import { Libro } from '../types/Libro';
import helper from '../services/helper';

const PageRanking = () => {
  const [libros, setLibros] = useState<Libro[]>([]);

  useEffect(() => {
    const fetchLibros = async () => {
      const data = await helper.getAllLibros();
      const top5 = [...data]
        .sort((a, b) => b.estrellas - a.estrellas)
        .slice(0, 5);
      setLibros(top5);
    };

    fetchLibros();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">⭐ Ranking Top 5 Libros</h1>
      <ul className="list-group">
        {libros.map((libro, index) => (
          <li
            key={libro.id}
            className="list-group-item d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center">
              <span className="me-3 fw-bold">#{index + 1}</span>
              {libro.url_foto && (
                <img
                  src={libro.url_foto}
                  alt={libro.nombre}
                  width="60"
                  height="80"
                  className="me-3 rounded"
                  style={{ objectFit: 'cover' }}
                />
              )}
              <div>
                <h5 className="mb-1">{libro.nombre}</h5>
                <small className="text-muted">Autor: {libro.autor}</small>
              </div>
            </div>
            <span className="badge bg-warning text-dark fs-6">
              ⭐ {libro.estrellas}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-center">
        <a href="/home" className="btn btn-secondary">⬅️ Volver al catálogo</a>
      </div>
    </div>
  );
};

export default PageRanking;
