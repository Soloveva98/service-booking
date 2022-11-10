import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import s from './Register.module.scss';
import { logout, fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import SuccessRegister from "../../components/SuccessRegister/SuccessRegister";
import { Link } from "react-router-dom";

function Register() {

	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();
	const [condition, setCondition] = useState(false);
	const [error, setError] = useState('');
	const [resetPass, setResetPass] = useState(false);


	const onLogout = () => {
		dispatch(logout());
		window.localStorage.removeItem('token');
	};

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			email: '',
			number: '',
			password: '',
			repPass: '',
			mode: 'onChange',
			tokenCaptcha: '',
		},
	});

	const password = watch('password');

	const captchaRef = useRef(null);

	const onSubmit = async (values) => {
		const tokenCaptcha = captchaRef.current.getValue();
		values.tokenCaptcha = tokenCaptcha;
		captchaRef.current.reset();

		const data = await dispatch(fetchRegister(values));

		if (!data.payload) {
			const error = data.error.message;
			if (error === 'Request failed with status code 409') {
				setResetPass(true);
				return;
			} else {
				setError('*Заполните все поля корректно и пройдите проверку CAPTCHA');
				return;
			}
		}

		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
			onLogout();
			setCondition(true);
		}
	};


	return (
		<div className={s.register}>
			<div className={s.register__form}>

				{
					condition ? (
						<SuccessRegister title='Регистрация пройдена успешно' />
					) : (
						<form onSubmit={handleSubmit(onSubmit)} className="form">

							<h3 className="form__title">Регистрация</h3>

							{
								resetPass ? (
									<div className="main__error">
										<p className="email__err">
											*Такой адрес электронной почты или номер телефона уже занят в системе
										</p>
										<p className="email__err">
											*Для восстановления пароля перейдите по ссылке -
											<Link to='/reset'>
												<button className="reset__pass">
													Восстановить пароль
												</button>
											</Link>
										</p>
										<p className="email__err">
											*Или пройдите -
											<Link to='/login'>
												<button className="reset__pass">
													Авторизацию
												</button>
											</Link>
										</p>
									</div>
								) : (
									<></>
								)
							}

							<div className="input__container">
								<input
									className="input"
									type="text"
									name="name"
									placeholder="input"
									style={{ borderColor: errors.name && 'red' }}
									{...register('name', {
										required: '*Введите имя',
										minLength: {
											value: 3,
											message: 'Введите корректное имя, минимум 3 символа',
										},
									})}
								/>
								<label for="name" className="label">
									Имя
								</label>
								<p className="error">{errors.name?.message}</p>
							</div>

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
									type="text"
									name="number"
									placeholder="input"
									style={{ borderColor: errors.number && 'red' }}
									{...register('number', {
										required: '*Введите номер телефона',
										minLength: {
											value: 11,
											message: 'Номер телефона должен содержать 11 цифр',
										},
										maxLength: {
											value: 11,
											message: 'Номер телефона должен содержать 11 цифр',
										}
									})}
								/>
								<label for="number" className="label">
									Телефон
								</label>
								<p className="error">{errors.number?.message}</p>
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

							<div className="input__container">
								<input
									className="input"
									type="password"
									name="repPass"
									placeholder="input"
									onPaste={(e) => {
										e.preventDefault();
										return false;
									}}
									style={{ borderColor: errors.repPass && 'red' }}
									{...register('repPass', {
										required: '*Повторите пароль',
										minLength: {
											value: 8,
											message: 'Пароль должен содержать минимум 8 символов',
										},
										validate: (value) =>
											value === password ||
											'Пароль не соответствует паролю, введенному выше',
									})}
								/>
								<label for="repPass" className="label">
									Повторите пароль
								</label>
								<p className="error">{errors.repPass?.message}</p>
							</div>

							<ReCAPTCHA
								sitekey={process.env.REACT_APP_SITE_KEY}
								ref={captchaRef}
								className={s.recaptcha}
							/>


							<p className="error__all">
								{error}
							</p>

							<button type="submit" className="btn">
								Зарегистрироваться
							</button>

						</form>
					)
				}
			</div>
		</div>
	)
}

export default Register;