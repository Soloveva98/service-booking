import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import s from './Login.module.scss';
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

function Login() {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();
	const [error, setError] = useState('');

	const { register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: {
			email: '',
			password: '',
		},

	});

	const onSubmit = async (values) => {
		const data = await dispatch(fetchAuth(values));
		if (!data.payload) {
			return setError('*Не удалось авторизоваться! Проверьте логин или пароль.');
		}
		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
		}
	};

	if (isAuth) {
		return <Navigate to="/account" />
	}


	return (
		<div className={s.login}>
			<div className={s.login__form}>
				<form onSubmit={handleSubmit(onSubmit)} className="form">
					<h3 className="form__title">Авторизация</h3>

					<p className={s.error}>{error}</p>

					<div className="input__container">
						<input
							className="input"
							type="email"
							name="email"
							placeholder="input"
							style={{ borderColor: errors.email && 'red' }}
							{...register('email', {
								required: '*Введите адрес электронной почты',
							})}
						/>
						<label for="email" className="label">
							E-mail
						</label>
						<p className="error">{errors.email?.message}</p>
					</div>

					<div className="input__container">
						<input
							className="input"
							type="password"
							name="password"
							placeholder="input"
							style={{ borderColor: errors.password && 'red' }}
							{...register('password', {
								required: '*Введите пароль',
								minLength: {
									value: 8,
									message: 'Пароль должен содержать минимум 8 символов',
								},
							})}
						/>
						<label for="pass" className="label">
							Пароль
						</label>
						<p className="error">{errors.password?.message}</p>
					</div>

					<button type="submit" className="btn">
						Войти
					</button>

					<p className="form__regist">
						Нет аккаунта?
						<Link to={'/register'}><span> Зарегистрироваться</span></Link>
					</p>
					<p className="form__regist">
						Забыли пароль?
						<Link to={'/reset'}><span> Восстановление пароля</span></Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Login;