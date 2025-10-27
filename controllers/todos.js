const todosRouter = require('express').Router();
const User = require('../models/user');
const Todo = require('../models/todo');

todosRouter.get('/', async (request, response) => {
    console.log("chao")
    const user = request.user;
    const todos = await Todo.find({ user: user.id });
    return response.status(200).json(todos);
})

todosRouter.post('/', async (request, response) => {
    const user = request.user;
    //obj {object} = 
    //desestructuracion {text} = obj
    const { text } = request.body;
    //definir nueva tarea
    const newTodo = new Todo({
        text,
        checked: false,
        //id del usuario que crea la tarea
        user: user._id
    });
    //.save mongoose method to save the new todo to the database
    const savedTodo = await newTodo.save();
    //concatena el id de la nueva tarea al array de tareas del usuario
    user.todos = user.todos.concat(savedTodo._id);
    //
    
    await user.save();
   
    
    return response.status(200).json(savedTodo);
})

todosRouter.delete('/:id', async (request, response) => {
    const user = request.user;
    
    await Todo.findByIdAndDelete(request.params.id)

    user.todos = user.todos.filter(todo => todo.id !== request.params.id);
    
    await user.save();
    return response.sendStatus(204);
})

todosRouter.patch('/:id', async (request, response) => {
    
    const user = request.user;

    const { checked } = request.body;

    await Todo.findByIdAndUpdate(request.params.id, { checked });

    return response.sendStatus(200);
})

module.exports = todosRouter;