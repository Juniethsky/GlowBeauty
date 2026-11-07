const API_URL = 'https://jsonplaceholder.typicode.com';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La conexión tardó demasiado. Intenta nuevamente.');
    }

    if (error instanceof TypeError) {
      throw new Error('No hay conexión a internet. Verifica tu red.');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}