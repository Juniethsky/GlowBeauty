export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: string;
  categoria: string;
}

export const servicios: Servicio[] = [
  {
    id: 1,
    nombre: 'Manicure',
    descripcion: 'Cuidado y embellecimiento de uñas.',
    precio: 250,
    duracion: '45 minutos',
    categoria: 'Uñas',
  },
  {
    id: 2,
    nombre: 'Pedicure',
    descripcion: 'Limpieza y cuidado de los pies.',
    precio: 350,
    duracion: '60 minutos',
    categoria: 'Uñas',
  },
  {
    id: 3,
    nombre: 'Maquillaje social',
    descripcion: 'Maquillaje para eventos y ocasiones especiales.',
    precio: 600,
    duracion: '60 minutos',
    categoria: 'Maquillaje',
  },
  {
    id: 4,
    nombre: 'Extensiones de pestañas',
    descripcion: 'Aplicación de extensiones para realzar la mirada.',
    precio: 800,
    duracion: '90 minutos',
    categoria: 'Pestañas',
  },
  {
    id: 5,
    nombre: 'Corte de cabello',
    descripcion: 'Corte y estilizado de cabello.',
    precio: 200,
    duracion: '40 minutos',
    categoria: 'Cabello',
  },
  {
    id: 6,
    nombre: 'Tratamiento capilar',
    descripcion: 'Hidratación y cuidado profundo del cabello.',
    precio: 500,
    duracion: '60 minutos',
    categoria: 'Tratamientos',
  },
];

export function obtenerServicios(): Servicio[] {
  return servicios;
}