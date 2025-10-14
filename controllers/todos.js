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
    const { text } = request.body;
    const newTodo = new Todo({
        text,
        checked: false,
        user: user._id
    });

    const savedTodo = await newTodo.save();
    user.todos = user.todos.concat(savedTodo._id);
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