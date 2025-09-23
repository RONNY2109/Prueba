const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require("./controllers/users");
const app = express();
const { MONGO_URI } = require('./config');

// CONEXION A MONGODB



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
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/signup', express.static(path.resolve('views', 'home', 'signup')));
app.use('/login', express.static(path.resolve('views', 'home', 'login')));
app.use('/components', express.static(path.resolve('views', 'home', 'components')));
app.use('/img', express.static(path.resolve('img')));
app.use('/verify/:id/token', express.static(path.resolve('views', 'home', 'components'))); // <-- corregido
app.use(morgan('tiny'));

//RUTAS BACKEND
app.use('/api/users', usersRouter)



module.exports = app;

