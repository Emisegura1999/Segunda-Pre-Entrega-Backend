//app.js

const express = require ("express");
const exphbs = require ("express-handlebars");
const { Server } = require ('socket.io');
const database = require('../database.js');
const cartsRouter = require ("./routes/carts.router.js");
const productsRouter = require ("./routes/products.router.js");
const viewsRouter = require ("./routes/views.router.js");
const MessageModel = require ("./models/messages.model.js");

const app = express();
const PUERTO = 8080;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));


//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);




//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

// chat del Ecommerce: 

const io = new Server(httpServer);

io.on("connection",  (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("message", async (data) => {

      //Guardo el mensaje en MongoDB: 
      await MessageModel.create(data);
console.log("Mensaje recibido", data)
      //Obtengo los mensajes de MongoDB y se los paso al cliente: 
      const messages = await MessageModel.find();
      console.log(messages);
      io.sockets.emit("messagesLogs", messages);
   
  })
})

