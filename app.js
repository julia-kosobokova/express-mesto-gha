const express = require("express");
const mongoose = require("mongoose");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");
const bodyParser = require("body-parser");

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "640704f0f13e086a58639d2a", // _id созданного пользователя
  };

  next();
});

app.use("/", routerUsers);
app.use("/", routerCards);

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
