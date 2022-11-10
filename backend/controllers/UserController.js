import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; //библиотека для шифрования паролей
import fetch from "node-fetch";
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
//проверяет корректность введенных данных
import { validationResult } from 'express-validator';
//импортируем модель пользователя
import UserModel from '../models/User.js';

dotenv.config();

//аккаунт, с которого будут отправляться письма с пинкодом
let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'devdevovich1@gmail.com',
		pass: process.env.REACT_APP_PASS_APP,
	},
});

//ОБРАБОТКА ЗАПРОСОВ

//регистрация

//проверка капчи
async function validateCaptcha(tokenCaptcha) {
	const response = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.REACT_APP_SECRET_KEY}&response=${tokenCaptcha}`,
		{
			method: "POST",
		}
	);
	const data = await response.json();
	return data.success;
};

//сама регистрация
export const register = async (req, res) => {
	try {
		const human = await validateCaptcha(req.body.tokenCaptcha);

		if (!human) {
			res.status(400);
			res.json({ errors: ["Ты бот"] });
			return;
		}

		const errors = validationResult(req); //нужно все вытащить из запроса

		//если ошибки не пустые, они есть, то мы должны вернуть ответ
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());//вернем все ошибки, которые смогли проанализировать
		}

		//необходимо вытащить из req.body пароль, и зашифровать его
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);//алгоритм шифрования пароля
		const hash = await bcrypt.hash(password, salt);

		//хотим подготовить документ, на создание пользователя
		const doc = new UserModel({
			name: req.body.name,
			email: req.body.email,
			number: req.body.number,
			passwordHash: hash,
		});

		//создаем самого пользователя в монгодб
		const user = await doc.save();//сохраняем документ

		//создаем токен
		const token = jwt.sign({
			_id: user._id,
		},
			'secret123',
			{
				expiresIn: '30d',//срок жизни токена
			}
		);

		//убираем из ответа passwordHash
		const { passwordHash, ...userData } = user._doc;

		//если ошибок нет, мы вернем информацию о пользователе
		res.json({
			...userData,
			token
		});

	} catch (err) {
		if (err.keyPattern) {
			res.status(409).json({
				message: 'Такой адрес электронной почты или номер телефона уже занят в системе',
			});
		} else {
			res.status(500).json({
				message: 'Не удалось зарегистрироваться',
			});
		}
	}
};

//авторизация
export const login = async (req, res) => {
	try {
		//ищем пользователя по имейл
		const user = await UserModel.findOne({ email: req.body.email });

		//если такой почты нет
		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			});
		}

		//если пользователь нашелся, нужно проверить сходится ли его пароль с тем, что он ввел
		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		//если пароли не сходятся
		if (!isValidPass) {
			return res.status(400).json({
				message: 'Неверный логин или пароль',
			});
		}

		//если логин и пароль верный, то создаем новый токен
		const token = jwt.sign({
			_id: user._id,
		},
			'secret123',
			{
				expiresIn: '30d',//срок жизни токена
			}
		);

		//убираем из ответа passwordHash
		const { passwordHash, ...userData } = user._doc;

		//и возвращаем ответ
		res.json({
			...userData,
			token
		});

	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось авторизоваться',
		});
	}
};

//информация обо мне
export const getMe = async (req, res) => {
	try {
		//нам необходимо найти пользователя
		const user = await UserModel.findById(req.userId)

		//если такого пользователя нет
		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден'
			});
		}

		//если пользователь нашелся
		//убираем из ответа passwordHash
		const { passwordHash, ...userData } = user._doc;

		//если ошибок нет, мы вернем информацию о пользователе
		res.json(userData);

	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Нет доступа',
		});
	}
};

//редактирование данных в личном кабинете
export const updateUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const newName = req.body.name;
		const newEmail = req.body.email;
		const newNumber = req.body.number;

		const updateUser = await UserModel.updateOne(
			{ _id: userId },
			{ $set: { name: newName, email: newEmail, number: newNumber } }
		);

		if (!updateUser) {
			res.status(404).json({
				message: 'Пользователь не найден'
			})
		}

		res.json(updateUser);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Пользователь не найден'
		});
	}
};

//изменение пароля в личном кабинете
export const changePassword = async (req, res) => {
	try {
		const userId = req.params.id;
		const oldPass = req.body.oldPass;
		const newPass = req.body.newPass;

		const user = await UserModel.findById(userId);

		//если такого пользователя нет
		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден'
			});
		}

		//если пользователь нашелся, нужно проверить сходится ли его пароль с тем, что он ввел в старом пароле
		const isValidPass = await bcrypt.compare(oldPass, user._doc.passwordHash);

		//если пароли не сходятся
		if (!isValidPass) {
			return res.status(400).json({
				message: 'Старый пароль неверный',
			});
		}

		//шифрую новый пароль
		const salt = await bcrypt.genSalt(10);//алгоритм шифрования пароля
		const hash = await bcrypt.hash(newPass, salt);

		//меняю пароль в базе
		await user.updateOne(
			{ $set: { passwordHash: hash } }
		);

		res.status(200).json({ message: 'Пароль успешно изменен' });

	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось сменить пароль'
		});
	}
};

//отправка пин-кода
export const sendPinCode = async (req, res) => {
	try {
		//ищем пользователя по имейл
		const userEmail = req.body.email;

		const user = await UserModel.findOne({ email: userEmail });

		//если такой почты нет
		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			});
		}

		const pinCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

		await user.updateOne(
			{ $set: { pin: pinCode } }
		);

		const emailMessage = await transporter.sendMail({
			from: '"Booking" <devdevovich1@gmail.com>',
			to: userEmail,
			subject: 'Сброс пароля',
			text: `Здравствуйте, ${user.name}! Забыли пароль? Давайте настроим новый! Код для сброса старого пароля. Игнорируйте это письмо, если вы не планировали смену пароля — все останется по-прежнему.`,
			html:
				`<div style="width: 430px; margin: 20px auto 0; padding: 15px; text-align: center; box-shadow: 1px 2px 5px #D07E2A;"><h2 style="color: #D07E2A; margin-bottom: 30px;">Здравствуйте, ${user.name}!</h2><p style="color: rgb(175, 171, 171)">Забыли пароль? Давайте настроим новый!</p><p style="color: #D07E2A">Код для сброса старого пароля:</p><p style="color: #D07E2A; font-size: 16px; font-weight: 700; letter-spacing: 3px">${pinCode}</p><p style="color: rgb(175, 171, 171)">Игнорируйте это письмо, если вы не планировали смену пароля — все останется по-прежнему.</p></div>`,
			attachments: [],
		});

		res.json({
			emailMessage,
		});

	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось отправить пин-код',
		});
	}
};

//проверка пин-кода
export const checkPinCode = async (req, res) => {
	try {

		const userEmail = req.body.email;
		const userPin = req.body.values.pin;

		const user = await UserModel.findOne({ email: userEmail });
		const pinCode = user.pin;

		//сравниваем пинкоды
		if (userPin === pinCode) {
			await user.updateOne(
				{ $unset: { pin: pinCode } }
			);
			return res.status(200).json({});
		} else {
			return res.status(404).json({
				message: 'Пин-код неверный',
			});
		}

	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось проверить пин-код',
		});
	}
};

//смена пароля
export const resetPassword = async (req, res) => {
	try {
		const userEmail = req.body.email;
		const newPass = req.body.values.password;

		const user = await UserModel.findOne({ email: userEmail });

		//шифрую новый пароль
		const salt = await bcrypt.genSalt(10);//алгоритм шифрования пароля
		const hash = await bcrypt.hash(newPass, salt);

		//меняю пароль в базе
		await user.updateOne(
			{ $set: { passwordHash: hash } }
		);

		res.status(200).json({ message: 'Пароль успешно изменен' });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось сменить пароль',
		});
	}
};