const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { login, createUser} = require('./controllers/users');
const auth = require('./middlewares/auth');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

const NOT_FOUND = 404;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '640704f0f13e086a58639d2a', // _id созданного пользователя
  };

  next();
});

// Роуты, которым не нужна авторизация
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/', router); // Роуты, которым нужна авторизация

app.use((req, res) => {
  res
    .status(NOT_FOUND)
    .send({ message: 'Страница по указанному маршруту не найдена' });
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
