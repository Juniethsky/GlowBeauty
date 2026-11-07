
import { Cita, NuevaCita } from '@/api/citasService';
import { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from 'react-native';

interface Props {
  cita?: Cita;
  onGuardar: (datos: NuevaCita) => Promise<void>;
  onCancelar: () => void;
  guardando: boolean;
}

export default function CitaForm({
  cita,
  onGuardar,
  onCancelar,
  guardando,
}: Props) {
  const datosIniciales = cita?.body.match(
    /^Cliente: (.*?) \| Fecha: (.*?) \| Hora: (.*)$/
  );

  const [cliente, setCliente] = useState(datosIniciales?.[1] ?? '');
  const [servicio, setServicio] = useState(cita?.title ?? '');
  const [fecha, setFecha] = useState(datosIniciales?.[2] ?? '');
  const [hora, setHora] = useState(datosIniciales?.[3] ?? '');
  const [errores, setErrores] = useState<Record<string, string>>({});

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!cliente.trim()) {
      nuevosErrores.cliente = 'Ingresa el nombre del cliente.';
    }

    if (!servicio.trim()) {
      nuevosErrores.servicio = 'Ingresa el servicio solicitado.';
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
      nuevosErrores.fecha = 'Usa el formato DD/MM/AAAA.';
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
      nuevosErrores.hora = 'Usa el formato HH:MM.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardar = async () => {
    if (!validar()) return;

    await onGuardar({
      userId: cita?.userId ?? 1,
      title: servicio.trim(),
      body: `Cliente: ${cliente.trim()} | Fecha: ${fecha} | Hora: ${hora}`,
    });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        {cita ? 'Editar cita' : 'Nueva cita'}
      </Text>
      <Text style={styles.subtitle}>
        {cita
          ? 'Modifica los datos de la cita.'
          : 'Completa los datos para reservar tu servicio.'}
      </Text>

      <Text style={styles.label}>Nombre del cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#A99BB2"
        value={cliente}
        onChangeText={setCliente}
      />
      {errores.cliente ? (
        <Text style={styles.error}>{errores.cliente}</Text>
      ) : null}

      <Text style={styles.label}>Servicio</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Manicure"
        placeholderTextColor="#A99BB2"
        value={servicio}
        onChangeText={setServicio}
      />
      {errores.servicio ? (
        <Text style={styles.error}>{errores.servicio}</Text>
      ) : null}

      <Text style={styles.label}>Fecha</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA"
        placeholderTextColor="#A99BB2"
        value={fecha}
        onChangeText={setFecha}
        keyboardType="numbers-and-punctuation"
      />
      {errores.fecha ? (
        <Text style={styles.error}>{errores.fecha}</Text>
      ) : null}

      <Text style={styles.label}>Hora</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM"
        placeholderTextColor="#A99BB2"
        value={hora}
        onChangeText={setHora}
      />
      {errores.hora ? (
        <Text style={styles.error}>{errores.hora}</Text>
      ) : null}

      <Pressable
        style={styles.button}
        onPress={guardar}
        disabled={guardando}
      >
        {guardando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            {cita ? 'Guardar cambios' : 'Guardar cita'}
          </Text>
        )}
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={onCancelar}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 22,
    paddingBottom: 35,
  },
  title: {
    color: '#56376C',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#9B8AA8',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 22,
  },
  label: {
    color: '#674080',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 7,
    marginTop: 13,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DCEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#56376C',
    fontSize: 14,
  },
  error: {
    color: '#C04466',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#8756AB',
    padding: 15,
    borderRadius: 13,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelButton: {
    padding: 14,
    alignItems: 'center',
    marginTop: 5,
  },
  cancelText: {
    color: '#8756AB',
    fontWeight: 'bold',
  },
});
