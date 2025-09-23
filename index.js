const app = require('./app');
//const { PAGE_URL } = require('./config')

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    //console.log(PAGE_URL);
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

//OTRA FORMA DE CREAR UN SERVIDOR
// const server = http.createServer(app);
// server.listen(3000, () =>{
//     console.log('El servidor esta corriendo');
// })