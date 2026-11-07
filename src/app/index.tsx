
import { servicios } from '@/api/serviciosService';
import {
  guardarFavoritos,
  guardarPreferencias,
  obtenerFavoritos,
  obtenerPreferencias,
} from '@/storage/localStorage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

export default function Inicio() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [mostrarPrecios, setMostrarPrecios] = useState(true);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const guardados = await obtenerFavoritos();
      const preferencias = await obtenerPreferencias() as {
        mostrarPrecios?: boolean;
      };

      setFavoritos(guardados);
      setMostrarPrecios(preferencias.mostrarPrecios ?? true);
      setCargandoDatos(false);
    }

    cargarDatos();
  }, []);

  const cambiarFavorito = async (id: number) => {
    const nuevosFavoritos = favoritos.includes(id)
      ? favoritos.filter((favorito) => favorito !== id)
      : [...favoritos, id];

    setFavoritos(nuevosFavoritos);
    await guardarFavoritos(nuevosFavoritos);
  };

  const cambiarMostrarPrecios = async (valor: boolean) => {
    setMostrarPrecios(valor);
    await guardarPreferencias({ mostrarPrecios: valor });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Glow Beauty</Text>
            <Text style={styles.subtitle}>Tu belleza, nuestro cuidado</Text>
          </View>
          <View style={styles.profile}>
            <Text style={styles.profileText}>G</Text>
          </View>
        </View>

        <View style={styles.welcome}>
          <Text style={styles.welcomeSmall}>BIENVENIDA A</Text>
          <Text style={styles.welcomeTitle}>Glow Beauty</Text>
          <Text style={styles.welcomeDescription}>
            Un espacio creado para consentirte y resaltar tu belleza.
          </Text>
          <Pressable
            style={styles.mainButton}
            onPress={() => router.push('/explore')}
          >
            <Text style={styles.mainButtonText}>Reservar una cita</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nuestros servicios</Text>
          <Text style={styles.sectionSubtitle}>
            Descubre lo que tenemos para ti
          </Text>
          <Text style={styles.favoriteCount}>
            ♥ {favoritos.length} servicios favoritos
          </Text>
        </View>

        <View style={styles.services}>
          {servicios.map((servicio) => {
            const esFavorito = favoritos.includes(servicio.id);

            return (
              <View style={styles.serviceCard} key={servicio.id}>
                <View style={styles.serviceIcon}>
                  <Text style={styles.iconText}>✦</Text>
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{servicio.nombre}</Text>
                  <Text style={styles.serviceDescription}>
                    {servicio.descripcion}
                  </Text>
                  {mostrarPrecios && (
                    <Text style={styles.servicePrice}>
                      C$ {servicio.precio}
                    </Text>
                  )}
                </View>
                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => cambiarFavorito(servicio.id)}
                  disabled={cargandoDatos}
                >
                  <Text
                    style={[
                      styles.favoriteIcon,
                      esFavorito && styles.favoriteActive,
                    ]}
                  >
                    {esFavorito ? '♥' : '♡'}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={styles.preferences}>
          <Text style={styles.sectionTitle}>Mis preferencias</Text>
          <Text style={styles.sectionSubtitle}>
            Personaliza tu experiencia en Glow Beauty.
          </Text>

          <View style={styles.preferenceCard}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Mostrar precios</Text>
              <Text style={styles.preferenceDescription}>
                Activa esta opción para ver los precios de los servicios.
              </Text>
            </View>
            <Switch
              value={mostrarPrecios}
              onValueChange={cambiarMostrarPrecios}
              disabled={cargandoDatos}
              trackColor={{ false: '#D9CADD', true: '#C7A5DF' }}
              thumbColor={mostrarPrecios ? '#8756AB' : '#F5F0F7'}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Glow Beauty</Text>
          <Text style={styles.footerDescription}>
            Un momento para ti, una belleza que inspira.
          </Text>
        </View>
      </ScrollView>
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
    paddingTop: 15,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#8B5BB5',
  },
  subtitle: {
    color: '#9B8AA8',
    fontSize: 12,
    marginTop: 3,
  },
  profile: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#EADCF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#8051A5',
    fontSize: 19,
    fontWeight: 'bold',
  },
  welcome: {
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 24,
    backgroundColor: '#E9D9F5',
  },
  welcomeSmall: {
    color: '#8051A5',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  welcomeTitle: {
    color: '#674080',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  welcomeDescription: {
    color: '#765D86',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  mainButton: {
    backgroundColor: '#8756AB',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 13,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionHeader: {
    paddingHorizontal: 22,
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#56376C',
    fontSize: 21,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: '#A092AA',
    fontSize: 13,
    marginTop: 5,
  },
  favoriteCount: {
    color: '#8756AB',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
  },
  services: {
    paddingHorizontal: 20,
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E8F5',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#F1E7F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },
  iconText: {
    color: '#9669B6',
    fontSize: 25,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    color: '#5E456F',
    fontSize: 15,
    fontWeight: 'bold',
  },
  serviceDescription: {
    color: '#A092AA',
    fontSize: 12,
    marginTop: 4,
  },
  servicePrice: {
    color: '#8756AB',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 7,
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 5,
  },
  favoriteIcon: {
    color: '#B9A9C4',
    fontSize: 28,
  },
  favoriteActive: {
    color: '#D94F85',
  },
  preferences: {
    paddingHorizontal: 22,
    marginTop: 30,
  },
  preferenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#F0E8F5',
    padding: 16,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceInfo: {
    flex: 1,
    paddingRight: 10,
  },
  preferenceTitle: {
    color: '#5E456F',
    fontSize: 14,
    fontWeight: 'bold',
  },
  preferenceDescription: {
    color: '#A092AA',
    fontSize: 12,
    marginTop: 5,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    color: '#8756AB',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerDescription: {
    color: '#A092AA',
    fontSize: 12,
    marginTop: 5,
  },
});
