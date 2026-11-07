import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CITAS: '@glowbeauty_citas',
  FAVORITOS: '@glowbeauty_favoritos',
  PREFERENCIAS: '@glowbeauty_preferencias',
};


export async function guardarDatos<T>(
  clave: string,
  datos: T
): Promise<void> {
  await AsyncStorage.setItem(clave, JSON.stringify(datos));
}


export async function obtenerDatos<T>(
  clave: string,
  valorInicial: T
): Promise<T> {
  try {
    const datos = await AsyncStorage.getItem(clave);
    return datos ? JSON.parse(datos) as T : valorInicial;
  } catch {
    return valorInicial;
  }
}


export async function guardarCitas(datos: any[]): Promise<void> {
  await guardarDatos(KEYS.CITAS, datos);
}


export async function obtenerCitasGuardadas(): Promise<any[]> {
  return obtenerDatos(KEYS.CITAS, []);
}

export async function guardarFavoritos(datos: number[]): Promise<void> {
  await guardarDatos(KEYS.FAVORITOS, datos);
}


export async function obtenerFavoritos(): Promise<number[]> {
  return obtenerDatos(KEYS.FAVORITOS, []);
}


export async function guardarPreferencias(datos: object): Promise<void> {
  await guardarDatos(KEYS.PREFERENCIAS, datos);
}


export async function obtenerPreferencias(): Promise<object> {
  return obtenerDatos(KEYS.PREFERENCIAS, {});
}