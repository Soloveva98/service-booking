import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { loginValidation, registerValidation, updateUserValidation } from './validations.js';//импортируем проверку наличия введенных данных при регистрации
import checkAuth from './utils/checkAuth.js';//ипортируем проверку возможности возвращения какой-либо информации
import * as UserController from './controllers/UserController.js';
import * as RoomsController from './controllers/RoomsController.js';

//const url = 'mongodb://localhost:27017/booking';
const router = express.Router();


mongoose.connect(process.env.MONGODB_URI)
	.then(() => console.log('DB OK'))
	.catch((err) => console.log('DB error', err));

//создали експрес приложение
const app = express();

//нужно научить наше приложение читать json
app.use(express.json());

//отключаем блокировку корс при запросах - разрешаем делать запрос откуда угодно
app.use(cors());

app.use("/", router);

//ЗАПРОСЫ
//1 - Запросы, связанные с регистрацией и авторизацией
//Авторизация на сайте
app.post('/auth/login', loginValidation, UserController.login);
//Регистрация пользователя - нам придет запрос на '/auth/register', мы потом проверим в registerValidation правильность данных, и если все норм, дадим ответ
app.post('/auth/register', registerValidation, UserController.register);
//Информация о себе
app.get('/auth/me', checkAuth, UserController.getMe);

//изменение данных в личном кабинете
app.post('/users/:id', checkAuth, updateUserValidation, UserController.updateUser);
app.post('/changepass/:id', UserController.changePassword);

//сброс пароля по имейл
app.post('/resetpassword', UserController.sendPinCode);
app.post('/reset/pin', UserController.checkPinCode);
app.post('/newpassword', UserController.resetPassword);

//2 - Запросы, связанные с карточками помещений
app.get('/rooms', RoomsController.getAll);//получение всех карточек
app.get('/rooms/:id', RoomsController.getOne);//получение одной карточки


//на какой порт прикрепить наше приложение node.js
app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('Server OK');
});