const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

let usuarios = [];
let interessados = [];
let pets = [];
let adocao = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "dods",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.set("views", path.join(__dirname, "views"));

// Middleware para verificar login
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Rotas
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  usuarios.push({ usuario: usuario, senha: senha });
  req.session.user = usuario;
  res.cookie("lastAccess", new Date().toLocaleString());
  res.redirect("/menu");
});

app.get("/menu", isAuthenticated, (req, res) => {
  const lastAccess = req.cookies.lastAccess || "N/A";
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Menu</title>
        <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
          margin: 0;
          padding: 0;
          text-align: center;
          color: #333;
        }

        h1 {
          margin-top: 20px;
          font-size: 24px;
          color: #007bff;
        }

        p {
          font-size: 18px;
          margin: 10px 0;
        }

        ul {
          list-style-type: none;
          padding: 0;
        }

        li {
          margin: 10px 0;
        }

        button {
          background-color: #007bff;
          color: #fff;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }

        button a {
          color: #fff;
          text-decoration: none;
          font-weight: bold;
        }

        button:hover {
          background-color: #0056b3;
        }

        button a:hover {
          text-decoration: underline;
        }
        </style>
      </head>
      <body>
        <h1>Bem-vindo, ultimo acesso em ${lastAccess}</h1>
        <p>Funcoes do sistema</p>
        <ul>
            <li><button><a href="/cadastrarInteressado" style="text-decoration: none">Cadastro de Interessados</a></button></li>
            <li><button><a href="/cadastrarPets" style="text-decoration: none">Cadastro de pets</a></button></li>
            <li><button><a href="/listarAdocao" style="text-decoration: none">Adotar um Pet</a></button></li>
        </ul>
      </body>
      </html>
    `);
});

app.get("/cadastrarInteressado", isAuthenticated, (req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cadastro de interessado</title>
          <style>
          body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          min-height: 100vh;
          color: #333;
        }

        h1 {
          color: #007bff;
          margin-bottom: 20px;
        }

        ul {
          list-style-type: none;
          padding: 0;
          margin-bottom: 20px;
        }

        li {
          margin-bottom: 10px;
        }

        button {
          background-color: #007bff;
          color: #fff;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }

        button a {
          color: #fff;
          text-decoration: none;
          font-weight: bold;
        }

        button:hover {
          background-color: #0056b3;
        }

        form {
          background: #fff;
          padding: 20px 30px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        form div {
          margin-bottom: 15px;
        }

        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
          color: #555;
        }

        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-sizing: border-box;
        }

        input:focus {
          border-color: #007bff;
          outline: none;
        }

        button[type="submit"] {
          width: 100%;
          background-color: #28a745;
          padding: 12px;
          font-size: 16px;
          margin-top: 10px;
        }

        button[type="submit"]:hover {
          background-color: #218838;
        }

          </style>
        </head>
        <body>
            <h1>Cadastro de interessado</h1>
              <ul>
                <li><button><a href="/menu" style="text-decoration: none">Voltar ao menu</a></button></li>
            </ul>
            <form action="/cadastrarInteressado" method="POST">
                <div>
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" placeholder="Digite seu nome" required>
                </div>
                <br>
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Digite seu email" required>
                </div>
                <br>
                <div>
                    <label for="telefone">Telefone:</label>
                    <input type="tel" id="telefone" name="telefone" placeholder="Digite seu telefone" required>
                </div>
                <br>
                <button type="submit">Enviar</button>
            </form>
        </body>
        </html>
      `);
});

app.post("/cadastrarInteressado", isAuthenticated, (req, res) => {
  const { nome, email, telefone } = req.body;
  if (!nome || !email || !telefone) {
    res.status(500).send("Campos invalidos");
    return;
  }
  interessados.push({ nome: nome, email: email, telefone: telefone });
  res.redirect("/listarInteressados");
});

app.get("/listarInteressados", isAuthenticated, (req, res) => {
  const pessoasInteressadas = interessados
    .map(
      (item) => `
    <tr>
      <td>${item.nome}</td>
      <td>${item.email}</td>
      <td>${item.telefone}</td>
    </tr>
  `
    )
    .join("");
  res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Interessados</title>
              <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 20px;
              color: #333;
              text-align: center;
            }

            h1 {
              color: #007bff;
              margin-bottom: 20px;
            }

            ul {
              list-style-type: none;
              padding: 0;
              margin-bottom: 20px;
            }

            li {
              display: inline-block;
              margin: 0 10px;
            }

            button {
              background-color: #007bff;
              color: #fff;
              border: none;
              padding: 10px 15px;
              border-radius: 5px;
              font-size: 16px;
              cursor: pointer;
            }

            button a {
              color: #fff;
              text-decoration: none;
              font-weight: bold;
            }

            button:hover {
              background-color: #0056b3;
            }

            table {
              width: 80%;
              margin: 0 auto;
              border-collapse: collapse;
              background: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }

            thead {
              background-color: #007bff;
              color: #fff;
            }

            th, td {
              padding: 12px 15px;
              text-align: left;
              border: 1px solid #ddd;
            }

            tbody tr:nth-child(even) {
              background-color: #f9f9f9;
            }

            tbody tr:hover {
              background-color: #f1f1f1;
            }

            th {
              font-weight: bold;
            }

            td {
              color: #555;
            }

            </style>
          </head>
          <body>
            <h1>Interessados</h1>
            <ul>
                <li><button><a href="/menu" style="text-decoration: none">Voltar ao menu</a></button></li>
                <li><button><a href="/cadastrarInteressado" style="text-decoration: none">Voltar ao cadastro</a></button></li>
            </ul>
            <table>
                <thead>
                <tr>
                   <th>Nome</th>
                   <th>E-mail</th>
                   <th>Telefone</th>
                </tr>
                </thead>
                <tbody>
                    ${pessoasInteressadas}
                </tbody>
            </table>
          </body>
          </html>
        `);
});

app.get("/cadastrarPets", isAuthenticated, (req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cadastro de pets</title>
            <style>
          body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          min-height: 100vh;
          color: #333;
        }

        h1 {
          color: #007bff;
          margin-bottom: 20px;
        }

        ul {
          list-style-type: none;
          padding: 0;
          margin-bottom: 20px;
        }

        li {
          margin-bottom: 10px;
        }

        button {
          background-color: #007bff;
          color: #fff;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }

        button a {
          color: #fff;
          text-decoration: none;
          font-weight: bold;
        }

        button:hover {
          background-color: #0056b3;
        }

        form {
          background: #fff;
          padding: 20px 30px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        form div {
          margin-bottom: 15px;
        }

        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
          color: #555;
        }

        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-sizing: border-box;
        }

        input:focus {
          border-color: #007bff;
          outline: none;
        }

        button[type="submit"] {
          width: 100%;
          background-color: #28a745;
          padding: 12px;
          font-size: 16px;
          margin-top: 10px;
        }

        button[type="submit"]:hover {
          background-color: #218838;
        }

          </style>
        </head>
        <body>
            <h1>Cadastro de pets</h1>
              <ul>
                <li><button><a href="/menu" style="text-decoration: none">Voltar ao menu</a></button></li>
            </ul>
            <form action="/cadastrarPets" method="POST">
                <div>
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" placeholder="Digite seu nome" required>
                </div>
                <br>
                <div>
                    <label for="raca">Raca:</label>
                    <input type="text" id="raca" name="raca" placeholder="Digite a raca" required>
                </div>
                <br>
                <div>
                    <label for="idade">idade em anos:</label>
                    <input type="number" id="idade" name="idade" placeholder="Idade" required>
                </div>
                <br>
                <button type="submit">Enviar</button>
            </form>
        </body>
        </html>
      `);
});

app.post("/cadastrarPets", isAuthenticated, (req, res) => {
  const { nome, raca, idade } = req.body;
  console.log(req.body, "body");
  if (!nome || !raca || !idade) {
    res.status(500).send("Campos invalidos");
    return;
  }
  pets.push({ nome: nome, raca: raca, idade: idade });
  res.redirect("/listarPets");
});

app.get("/listarPets", isAuthenticated, (req, res) => {
  const petsCadastrados = pets
    .map(
      (item) => `
    <tr>
      <td>${item.nome}</td>
      <td>${item.raca}</td>
      <td>${item.idade}</td>
    </tr>
  `
    )
    .join("");
  res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Interessados</title>
            <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 20px;
              color: #333;
              text-align: center;
            }

            h1 {
              color: #007bff;
              margin-bottom: 20px;
            }

            ul {
              list-style-type: none;
              padding: 0;
              margin-bottom: 20px;
            }

            li {
              display: inline-block;
              margin: 0 10px;
            }

            button {
              background-color: #007bff;
              color: #fff;
              border: none;
              padding: 10px 15px;
              border-radius: 5px;
              font-size: 16px;
              cursor: pointer;
            }

            button a {
              color: #fff;
              text-decoration: none;
              font-weight: bold;
            }

            button:hover {
              background-color: #0056b3;
            }

            table {
              width: 80%;
              margin: 0 auto;
              border-collapse: collapse;
              background: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }

            thead {
              background-color: #007bff;
              color: #fff;
            }

            th, td {
              padding: 12px 15px;
              text-align: left;
              border: 1px solid #ddd;
            }

            tbody tr:nth-child(even) {
              background-color: #f9f9f9;
            }

            tbody tr:hover {
              background-color: #f1f1f1;
            }

            th {
              font-weight: bold;
            }

            td {
              color: #555;
            }

            </style>
          </head>
          <body>
            <h1>Interessados</h1>
            <ul>
                <li><button><a href="/menu" style="text-decoration: none">Voltar ao menu</a></button></li>
                <li><button><a href="/cadastrarPets" style="text-decoration: none">Voltar ao cadastro</a></button></li>
            </ul>
            <table>
                <thead>
                <tr>
                   <th>Nome</th>
                   <th>Raca</th>
                   <th>idade</th>
                </tr>
                </thead>
                <tbody>
                    ${petsCadastrados}
                </tbody>
            </table>
          </body>
          </html>
        `);
});

app.get("/listarAdocao", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "adocao.html"));
});

app.get("/renderizarAdocoes", isAuthenticated, (req, res) => {
  res.json(adocao);
});
app.get("/renderizarPest", isAuthenticated, (req, res) => {
  res.json(pets);
});
app.get("/renderizarInteressados", isAuthenticated, (req, res) => {
  res.json(interessados);
});

app.post("/cadastrarAdocao", isAuthenticated, (req, res) => {
  const { interessado, pet } = req.body;
  if (!interessado || !pet) {
    res.status(500).send("Campos invalidos");
    return;
  }
  adocao.push({
    interessado: interessado,
    pet: pet,
    registradoEm: new Date().toLocaleString(),
  });
  res.redirect("/listarAdocao");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta", 3000);
});
