const mongoose = require("mongoose");

//CON EL SCHEMA DEFINIMOS LA ESTRUCTURA DE LA COLECCION DE LOS USUARIOS Y EL TIPO DE DATO
const todoSchema = new mongoose.Schema({
    text: String,
    checked: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
});


//MONGO DB CREA UN ID POR DEFAULT _ID

//set la forma en que se va a mostrar el objeto cuando se convierta a JSON

todoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;