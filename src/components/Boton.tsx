import React from 'react';
import { IconType } from 'react-icons';

interface BotonProps {
  texto: string;
  onClick?: () => void;
  icono?: IconType;
  color?: string;
}

const Boton: React.FC<BotonProps> = ({ texto, onClick, icono: Icono, color = 'bg-green-500' }) => {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-transform duration-200`}
    >
      {Icono && <Icono size={18} />}
      {texto}
    </button>
  );
};

export default Boton;
