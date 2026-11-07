import { apiRequest } from './client';

export interface Cita {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export type NuevaCita = Omit<Cita, 'id'>;


export async function obtenerCitas(): Promise<Cita[]> {
  return apiRequest<Cita[]>('/posts');
}

export async function obtenerCita(id: number): Promise<Cita> {
  return apiRequest<Cita>(`/posts/${id}`);
}


export async function crearCita(datos: NuevaCita): Promise<Cita> {
  return apiRequest<Cita>('/posts', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}


export async function actualizarCita(
  id: number,
  datos: NuevaCita
): Promise<Cita> {
  return apiRequest<Cita>(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}


export async function eliminarCita(id: number): Promise<void> {
  await apiRequest<void>(`/posts/${id}`, {
    method: 'DELETE',
  });
}