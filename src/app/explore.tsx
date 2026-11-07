import {
  Cita,
  NuevaCita,
  actualizarCita,
  crearCita,
  eliminarCita,
  obtenerCitas,
} from '@/api/citasService';
import CitaForm from '@/components/CitaForm';
import {
  guardarCitas,
  obtenerCitasGuardadas,
} from '@/storage/localStorage';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ID_CITA_LOCAL = 1000000000000;

export default function CitasScreen() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);
  const [error, setError] = useState('');
  const [fuenteDatos, setFuenteDatos] = useState<'local' | 'servidor' | ''>('');

  const cargarCitas = useCallback(async () => {
    setError('');

    try {
      const guardadas = await obtenerCitasGuardadas();
      const citasPropias = guardadas.filter(
        (cita) => cita.id >= ID_CITA_LOCAL
      );

      setCitas(citasPropias);
      setFuenteDatos(citasPropias.length > 0 ? 'local' : '');

      if (citasPropias.length !== guardadas.length) {
        await guardarCitas(citasPropias);
      }

      try {
        await obtenerCitas();

        if (citasPropias.length === 0) {
          setFuenteDatos('servidor');
        }
      } catch {
        if (citasPropias.length === 0) {
          setError(
            'No fue posible conectar con el servidor. Comprueba tu conexión e inténtalo nuevamente.'
          );
        }
      }
    } catch {
      setError(
        'No fue posible cargar las citas guardadas. Inténtalo nuevamente.'
      );
    } finally {
      setCargando(false);
      setActualizando(false);
    }
  }, []);

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  const actualizar = () => {
    setActualizando(true);
    cargarCitas();
  };

  const guardarCita = async (datos: NuevaCita) => {
    setGuardando(true);

    try {
      if (citaEditando) {
        let sincronizado = true;

        if (citaEditando.id < ID_CITA_LOCAL) {
          try {
            await actualizarCita(citaEditando.id, datos);
          } catch {
            sincronizado = false;
          }
        }

        const actuales = await obtenerCitasGuardadas();

        const actualizadas = actuales.map((item) =>
          item.id === citaEditando.id
            ? { ...citaEditando, ...datos }
            : item
        );

        await guardarCitas(actualizadas);
        setCitas(
          actualizadas.filter((item) => item.id >= ID_CITA_LOCAL)
        );
        setFuenteDatos('local');
        setCitaEditando(null);
        setMostrarFormulario(false);

        Alert.alert(
          'Glow Beauty',
          sincronizado
            ? 'Los cambios se guardaron correctamente en este dispositivo.'
            : 'Los cambios se guardaron en este dispositivo. No fue posible contactar al servidor.'
        );
      } else {
        let sincronizado = true;

        try {
          await crearCita(datos);
        } catch {
          sincronizado = false;
        }

        const nueva: Cita = {
          ...datos,
          id: Date.now(),
        };

        const actuales = await obtenerCitasGuardadas();
        const citasPropias = actuales.filter(
          (item) => item.id >= ID_CITA_LOCAL
        );

        const actualizadas = [
          nueva,
          ...citasPropias.filter((item) => item.id !== nueva.id),
        ];

        await guardarCitas(actualizadas);
        setCitas(actualizadas);
        setFuenteDatos('local');
        setMostrarFormulario(false);

        Alert.alert(
          'Glow Beauty',
          sincronizado
            ? 'La cita se guardó en este dispositivo.'
            : 'La cita se guardó en este dispositivo aunque no se pudo contactar al servidor.'
        );
      }
    } catch {
      Alert.alert('Error', 'No fue posible guardar la cita en el dispositivo.');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = (cita: Cita) => {
    Alert.alert(
      'Eliminar cita',
      '¿Estás segura de que deseas eliminar esta cita?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => ejecutarEliminacion(cita),
        },
      ]
    );
  };

  const ejecutarEliminacion = async (cita: Cita) => {
    try {
      let sincronizado = true;

      if (cita.id < ID_CITA_LOCAL) {
        try {
          await eliminarCita(cita.id);
        } catch {
          sincronizado = false;
        }
      }

      const actuales = await obtenerCitasGuardadas();
      const actualizadas = actuales.filter(
        (item) => item.id !== cita.id
      );

      await guardarCitas(actualizadas);

      setCitas(
        actualizadas.filter((item) => item.id >= ID_CITA_LOCAL)
      );

      setFuenteDatos('local');

      Alert.alert(
        'Glow Beauty',
        sincronizado
          ? 'La cita fue eliminada de este dispositivo.'
          : 'La cita fue eliminada de este dispositivo. No fue posible contactar al servidor.'
      );
    } catch {
      Alert.alert('Error', 'No fue posible eliminar la cita.');
    }
  };

  const abrirEdicion = (cita: Cita) => {
    setCitaEditando(cita);
    setMostrarFormulario(true);
  };

  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setCitaEditando(null);
  };

  const renderCita = ({ item }: { item: Cita }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.icono}>
          <Text style={styles.iconoTexto}>✦</Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardId}>Cita #{item.id}</Text>
        </View>

        <Text style={styles.estado}>Registrada</Text>
      </View>

      <Text style={styles.cardDescription}>{item.body}</Text>

      <View style={styles.actions}>
        <Pressable
          style={styles.editButton}
          onPress={() => abrirEdicion(item)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() => confirmarEliminar(item)}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );

  if (mostrarFormulario) {
    return (
      <SafeAreaView style={styles.container}>
        <CitaForm
          cita={citaEditando ?? undefined}
          onGuardar={guardarCita}
          onCancelar={cancelarFormulario}
          guardando={guardando}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Glow Beauty</Text>
        <Text style={styles.title}>Mis citas</Text>
        <Text style={styles.subtitle}>
          Consulta y administra las citas de nuestro salón.
        </Text>

        <Pressable
          style={styles.addButton}
          onPress={() => {
            setCitaEditando(null);
            setMostrarFormulario(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Registrar nueva cita</Text>
        </Pressable>
      </View>

      {fuenteDatos === 'local' && citas.length > 0 && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            ✓ Mostrando citas guardadas en este dispositivo
          </Text>
        </View>
      )}

      {error !== '' && (
        <View style={styles.message}>
          <Text style={styles.messageText}>{error}</Text>
          <Pressable onPress={cargarCitas}>
            <Text style={styles.retry}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      {cargando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#8756AB" />
          <Text style={styles.loadingText}>Cargando citas...</Text>
        </View>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCita}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={actualizando}
              onRefresh={actualizar}
              tintColor="#8756AB"
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyIcon}>♡</Text>
              <Text style={styles.emptyTitle}>No hay citas disponibles</Text>
              <Text style={styles.emptyText}>
                Registra tu primera cita para verla aquí.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF9FF',
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 20,
  },
  logo: {
    color: '#8756AB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: '#56376C',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 14,
  },
  subtitle: {
    color: '#9B8AA8',
    fontSize: 13,
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#8756AB',
    padding: 14,
    borderRadius: 13,
    alignItems: 'center',
    marginTop: 18,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  offlineBanner: {
    backgroundColor: '#F1E7F8',
    padding: 11,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 10,
  },
  offlineText: {
    color: '#674080',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#F0E8F5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icono: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#F1E7F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconoTexto: {
    color: '#8756AB',
    fontSize: 23,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: '#56376C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardId: {
    color: '#A092AA',
    fontSize: 11,
    marginTop: 4,
  },
  estado: {
    color: '#8756AB',
    backgroundColor: '#F1E7F8',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#897B91',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  editButton: {
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F1E7F8',
  },
  editButtonText: {
    color: '#8756AB',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#FCEAF0',
  },
  deleteButtonText: {
    color: '#C04466',
    fontSize: 12,
    fontWeight: 'bold',
  },
  message: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#F3EAF8',
    padding: 13,
    borderRadius: 12,
  },
  messageText: {
    color: '#674080',
    fontSize: 12,
  },
  retry: {
    color: '#8756AB',
    fontWeight: 'bold',
    marginTop: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    color: '#8756AB',
    marginTop: 12,
  },
  emptyIcon: {
    color: '#B58ACF',
    fontSize: 48,
  },
  emptyTitle: {
    color: '#56376C',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptyText: {
    color: '#9B8AA8',
    textAlign: 'center',
    marginTop: 7,
    fontSize: 13,
  },
});