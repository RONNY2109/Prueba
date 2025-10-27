const mongoose = require("mongoose");

// estructura de la coleccion de usuarios nombre, email, passwordHash, verified

//__v es una "version key" o (llave de version) que mongoose usa internamente para rastrear las revisiones de documentos en una coleccion

//CON EL SCHEMA DEFINIMOS LA ESTRUCTURA DE LA COLECCION DE LOS USUARIOS Y EL TIPO DE DATO
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    verified: {
        type: Boolean,
        default: false
    },
     todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }]
});


//MONGO DB CREA UN ID POR DEFAULT _ID

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;