const loginRouter= require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt");
const usersRouter = require("./users");
const jwt = require("jsonwebtoken");
const { response } = require("express");


loginRouter.post("/", async (req,res) =>{
    const { email, password} = req.body;
    const userExist = await User.findOne({email});


    console.log(  "este es el usuario existente", userExist)
   

    //para comprobar que los datos del usuario son los correctos
    //email o contraseña
    if(!userExist){
        return  res.status(400).json({error:"email o contraseña invalida"})
    }
    //email
    if (!userExist.verified) {
        return res.status(400).json({error:"Tu email no ha sido verificado"})
    }

    //contraseña  necesitos importa bcrypt y usamos el metodo bcrypt.compare

    
     const isCorrect = await bcrypt.compare(password, userExist.passwordHash)
    
    if (!isCorrect) {
         return  res.status(400).json({ error:"Email o contraseña invalida"})
    }

    const userForToken = {
        id: userExist.id,
    }
    const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d"
    })
     
    // para expirar los tokens en las cookies primero van milisegundos*segundos*horas*dias
    res.cookie("accessToken", accessToken , {
        expires: new Date(Date.now()+ 1000 *60 *60* 24),
        secure: process.env.NODE_ENV === "production",
        // httpOnly lo que hace es que no se pueda acceder a la cookie desde el frontend
        httpOnly: true
    });
    return res.sendStatus(200)

});


module.exports = loginRouter