import { body } from 'express-validator';

export const loginValidation = [
	body('email', 'Неверно введена почта').isEmail(), //если в нашем теле есть 'email', проверь является ли оно имейлом
	body('password', 'Пароль должен содержать минимум 8 символов').isLength({ min: 8 }), //если пароль больше 8 символов, то норм, иди дальше
	body('name', 'Укажите имя').isLength({ min: 3 }),
];

export const registerValidation = [
	body('name', 'Укажите имя').isLength({ min: 3 }),
	body('email', 'Неверно введена почта').isEmail(), //если в нашем теле есть 'email', проверь является ли оно имейлом
	body('number', 'Номер телефона должен содержать 11 цифр').isLength({ min: 11, max: 11 }).isMobilePhone('ru-RU'),
	body('password', 'Пароль должен содержать минимум 8 символов').isLength({ min: 8 }), //если пароль больше 8 символов, то норм, иди дальше
];

export const updateUserValidation = [
	body('email', 'Неверно введена почта').isEmail(), //если в нашем теле есть 'email', проверь является ли оно имейлом
	body('name', 'Укажите имя').isLength({ min: 3 }),
	body('number', 'Номер телефона должен содержать 11 цифр').isLength({ min: 11, max: 11 }),
];
