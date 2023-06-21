const express = require("express");
const path = require("path");

//Middlewares globais
const methodOverride = require("method-override"); // métodos PUT e DELETE
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes/routes.js"); // importa o módulo de rotas
const loggedUserDataMiddleware = require("./middlewares/LoggedUserData.js");

const app = express(); //Cria a instância do express

app.use(cookieParser()); // Desmembra cookies
app.use(express.static(path.resolve("public"))); // Seta os arquivos da public como estáticos
app.use(express.urlencoded({ extended: false })); // captura na forma de objeto literal tudo o que vem de um formulário
app.use(methodOverride("_method")); // métodos PUT e DELETE
app.use(cors()); // Habilita o middleware do CORS

app.use(loggedUserDataMiddleware); //Middleware de salvar os dados do usuário logado

app.use(express.json()); // middle que transforma Json requests and objetos no req.body
app.use(routes); //usa o route importado como middleware

app.listen(3000, () => {
  console.log("servidor iniciado");
});
