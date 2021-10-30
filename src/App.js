import React, { useEffect, useState } from 'react';
import './style.css';
const BASE_URL = 'https://www.breakingbadapi.com/api/';

//0. Funcion cualquiera (minuscula al inicio, camelcase)
async function listaPersonajes() {
  return fetch(BASE_URL + 'characters').then((response) => response.json());
}

//1. Componente Card

function Card({
  personaje,
  addLabel,
  removeLabel,
  onClickFavorito,
  showButton,
}) {
  const [favorito, setfavorito] = useState(false);

  const toggleFavorito = () => {
    setfavorito(!favorito);
    if (onClickFavorito) {
      onClickFavorito(!favorito, personaje);
    }
  };
  return (
    <div>
      <img className="imagen" src={personaje.img} />
      <div>{personaje.name}</div>
      <div>{personaje.birthday}</div>
      <div>{personaje.nickname}</div>
      <ul>
        {personaje.occupation.map((i) => (
          <li>{i}</li>
        ))}
      </ul>
      {showButton && (
        <button onClick={toggleFavorito} type="button">
          {favorito ? removeLabel : addLabel}
        </button>
      )}
    </div>
  );
}

//1.1 Componente Header
function Header({ personajes, numFavoritos, onRecargar, onLimpiarFavoritos }) {
  const recargar = () => {
    if (onRecargar) {
      onRecargar();
    }
  };

  const limpiarFavoritos = () => {
    if (onLimpiarFavoritos) {
      onLimpiarFavoritos();
    }
  };
  return (
    <div className="columnas">
      <div className="personajes">
        Personajes ({personajes.length})
        <button onClick={recargar}>Recargar</button>
      </div>
      <div className="favoritos">
        Favoritos ({numFavoritos})
        <button onClick={limpiarFavoritos}>Limpiar favoritos</button>
      </div>
    </div>
  );
}

//2. Componente App (Principal)
export default function App() {
  const [personajes, setPersonajes] = useState([]);
  const [personajesFavoritos, setPersonajesFavoritos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  const inicio = () => {
    listaPersonajes().then((response) => {
      setPersonajes(response);
      console.log(response);
    });
  };

  const limpiarTodo = () => {
    setPersonajes([]);
    inicio();
    setPersonajesFavoritos([]);
    setFavoritos(0);
  };

  const onClickFavorito = (favorito, personaje) => {
    console.log(favorito, personaje);
    if (favorito) {
      const a = [...personajesFavoritos, personaje];
      setPersonajesFavoritos([...personajesFavoritos, personaje]);
      setFavoritos(favoritos + 1);
    } else {
      //quitar el personaje de personajeFavoritos
      const b = personajesFavoritos.filter((_personaje) => {
        return personaje.char_id !== _personaje.char_id;
      });
      setPersonajesFavoritos(b);
      setFavoritos(favoritos - 1);
    }
  };

  useEffect(inicio, []);
  return (
    <div>
      <Header personajes={personajes} numFavoritos={favoritos} />
      <div className="columnas">
        <div className="personajes">
          {personajes.map((personaje) => (
            <Card
              personaje={personaje}
              addLabel={'Agregar a favorito'}
              removeLabel={'Quitar de favorito'}
              onClickFavorito={onClickFavorito}
              showButton={true}
            />
          ))}
        </div>

        <div className="favoritos">
          {personajesFavoritos.map((personaje) => (
            <Card
              personaje={personaje}
              addLabel={'Agregar a favorito'}
              removeLabel={'Quitar de favorito'}
              onClickFavorito={onClickFavorito}
              showButton={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
