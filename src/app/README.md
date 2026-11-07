Glow Beauty – Gestión de salón de belleza

Descripción del proyecto

Glow Beauty es una aplicación móvil desarrollada con React Native y Expo para la gestión de citas de un salón de belleza. Permite registrar, consultar, editar y eliminar citas, así como guardar servicios favoritos y preferencias del usuario.

Tecnologías utilizadas

React Native

Expo SDK 58

TypeScript

Expo Router

JSONPlaceholder para el consumo de API REST

AsyncStorage para el almacenamiento local

Funcionalidades principales

Registro de nuevas citas.

Consulta de citas registradas.

Edición de citas existentes.

Eliminación de citas.

Validación de campos del formulario.

Mensajes de error y opción para reintentar.

Indicador de carga de información.

Mensaje cuando no existen citas registradas.

Almacenamiento local de citas.

Guardado de servicios favoritos.

Persistencia de preferencias del usuario.

Arquitectura del proyecto

El proyecto está organizado en diferentes carpetas para separar las responsabilidades:

src/app: contiene las pantallas y navegación de la aplicación.

src/api: contiene los servicios encargados de realizar las solicitudes HTTP.

src/components: contiene los componentes reutilizables y formularios.

src/storage: contiene las funciones para guardar y recuperar información local.

src/constants: contiene constantes y configuraciones.

src/hooks: contiene los hooks de la aplicación.

src/utils: contiene funciones auxiliares.

Consumo de API

Se utiliza JSONPlaceholder como API REST de prueba, específicamente el recurso /posts.

Las operaciones implementadas son:

GET: consultar registros.

POST: crear registros.

PUT: actualizar registros.

DELETE: eliminar registros.

Las solicitudes HTTP se encuentran separadas de las pantallas mediante una capa de servicios.

Nota técnica: JSONPlaceholder es un servicio de pruebas. Las operaciones de creación, actualización y eliminación simulan respuestas del servidor, pero no conservan permanentemente los cambios en él.

Almacenamiento local

Se utiliza AsyncStorage para conservar información en el dispositivo.

Se almacena:

Citas registradas por el usuario.

Servicios favoritos.

Preferencias de la aplicación.

Esto permite conservar los datos locales incluso después de cerrar y volver a abrir la aplicación.

Manejo de errores

La aplicación contempla situaciones como:

Falta de conexión a Internet.

Tiempo de espera agotado.

Respuestas de error del servidor.

Errores al guardar o eliminar información.

También dispone de indicadores de carga, mensajes informativos y opciones para reintentar las solicitudes.

Instalación y ejecución

Requisitos

Node.js.

npm.

Visual Studio Code.

Expo Go o un dispositivo compatible.

Pasos

Descargar o clonar el repositorio.

Abrir la carpeta del proyecto en Visual Studio Code.

Abrir una terminal en la carpeta principal.

Ejecutar:

npm install

Iniciar el proyecto:

npx expo start

Escanear el código QR con Expo Go para abrir la aplicación.

Decisiones técnicas

Se utilizó una arquitectura separada por capas para facilitar el mantenimiento del código. Los servicios API se encargan de las solicitudes al servidor y AsyncStorage permite conservar los datos localmente.

Se seleccionó JSONPlaceholder como servicio de prueba para implementar las operaciones CRUD sin necesidad de desarrollar un servidor propio.

Conclusión

Glow Beauty integra el consumo de una API REST, operaciones CRUD, validación de formularios y almacenamiento local. La aplicación permite administrar citas y conservar información importante en el dispositivo, ofreciendo una experiencia funcional incluso cuando no hay conexión a Internet para consultar el servidor.