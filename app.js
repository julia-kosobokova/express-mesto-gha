const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { login, createUser} = require('./controllers/users');
const auth = require('./middlewares/auth');
const { NotFoundError } = require('./errors/not-found-error');
const { errorHandler } = require('./middlewares/error-handler');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Роуты, которым не нужна авторизация
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/', router); // Роуты, которым нужна авторизация

app.use(() => {
  throw new NotFoundError('Страница по указанному маршруту не найдена');
});

app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
