const mongoose = require("mongoose");

//CON EL SCHEMA DEFINIMOS LA ESTRUCTURA DE LA COLECCION DE LOS USUARIOS Y EL TIPO DE DATO
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    verified: {
        type: Boolean,
        default: false
    }
});

//MONGO DB CREA UN ID POR DEFAULT ID_ Y POR ESO SE DEVUELVE EL .ID
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

