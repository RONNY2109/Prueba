const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const todosRouter = require("./controllers/todos");
const {userExtractor} = require("./middleware/auth");
const { MONGO_URI } = require("./config");
const app = express();



(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a Mongo DB');
  } catch(error) {
    console.log(error);
  }
})();

// Middleware para parsear JSON y datos de formulario
app.use(cors());
app.use(express.json());
app.use(cookieParser());


//RUTAS FRONTEND
// Rutas corregidas según la estructura real
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/components', express.static(path.resolve('views','components')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/signup', express.static(path.resolve('views', 'singup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/todos', express.static(path.resolve('views', 'todos')));
app.use('/img', express.static(path.resolve('img')));
app.use("/verify/:id/:token",express.static(path.resolve("views", "verify")))


app.use(morgan('tiny'));



//RUTAS BACKEND
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/todos', userExtractor, todosRouter);


module.exports = app;

//MVC Model View Controller (Modelo-Vista-Controlador)

//El patrón divide la aplicación en tres capas o partes, cada una con una responsabilidad bien definida:

// 1. Modelo (Model)
// Responsabilidad: Gestionar los datos, la lógica de negocio y las reglas de la aplicación.

// Función: Se encarga de la comunicación con la base de datos (guardar, consultar, actualizar datos), realizar cálculos, validaciones y cualquier otra lógica central de la aplicación.

// No depende de: La interfaz de usuario (Vista) o la forma en que se interactúa con ella (Controlador).

// En resumen: Qué son los datos y Qué se puede hacer con ellos.

// 2. Vista (View)
// Responsabilidad: Presentar los datos al usuario y capturar la interacción del usuario.

// Función: Es la interfaz de usuario (UI). En aplicaciones web, suele ser el código HTML, CSS y JavaScript. Su única función es mostrar la información que le proporciona el Modelo (generalmente a través del Controlador).

// No contiene: Lógica de negocio.

// En resumen: Cómo se ven los datos.

// 3. Controlador (Controller)
// Responsabilidad: Actuar como intermediario entre el Modelo y la Vista.

// Función: Recibe las peticiones del usuario (entrada), determina qué Modelos deben ser utilizados para procesar la información, llama a la lógica de negocio y, finalmente, selecciona la Vista apropiada para mostrar el resultado al usuario.

// En resumen: Qué hacer con la entrada del usuario y Qué mostrar como respuesta.

// resumen 

// Modelo: Gestiona los datos y la lógica de negocio.
// Vista: Presenta los datos al usuario.
// Controlador: Maneja la interacción entre el Modelo y la Vista.