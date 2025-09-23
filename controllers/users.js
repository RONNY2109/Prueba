const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const { PAGE_URL } = require('../config');
const { token } = require('morgan');

//ENDPOINT
usersRouter.post('/', async (req, res) =>{
    console.log(req.body);
    
    const {name, email, password} = req.body;
    
    //VALIDACION A NIVEL DE BACKEND
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos los espacions son requeridos' });
    }


    //validacion de email existente
    const userExists = await User.findOne({ email });

    console.log(userExists);
    

    if(userExists) {
        return res.status(400).json({ error: 'El correo ya esta registrado' });
    }
     
    //ENCRYPTACION DE LA CONTRASE;A
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log(passwordHash);

   // REGISTRO DE BASE DE DATOS
     const newUser = new User({
         name, 
         email,
         passwordHash,
     });

     const savedUser = await newUser.save();
    console.log(savedUser);

   // TRABAJAR CON LOS  WEB TOKEN
     const token = jwt.sign({ id: savedUser.id }, process.env.ACCESS_TOKEN_SECRET, {
         expiresIn: '10m'
    });

    NODEMAILER
     const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: false, // true for 465, false for other ports
   auth: {
     user: process.env.EMAIL_USER,
     pass: process.env.EMAIL_PASS,
     },
 });
  
 //Wrap in an async IIFE so we can use await.
 (async () => {
   try {
     const info = await transporter.sendMail({
       from: process.env.EMAIL_USER, // sender address
       to: savedUser.email, // list of receivers
       subject: "Verificacion de usuario", // Subject line
       html: `<a href="${PAGE_URL}/${token}">Verificar correo</a>`, // html body
 });

    return res.status(201).json('Usuario creado. Por favor verifica tu correo')

//     console.log("Message sent: %s", info.messageId);
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
   } catch (err) {
     console.error("Error while sending mail", err);
   }
 })();

});


usersRouter.patch('/:token', async (req, res) => {
  try{
 console.log(req.params.token);
 const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 console.log(decodedToken);
 
  }catch(error){

    
    return res.status(401).json({ error: 'Token invalido o expirado' });
  }
});

module.exports = usersRouter;

//colocar un pequeño string concatenando para saber de donde salio eso y no se pierda en la base de datos