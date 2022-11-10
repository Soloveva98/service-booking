import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "..//..//..//axios";
import SuccessRegister from "../../../components/SuccessRegister/SuccessRegister";


function NewPass() {
	const [errMessage, setErrMessage] = useState('');
	const [email, setEmail] = useState('');
	const [condition, setCondition] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			password: '',
			repPass: '',
			mode: 'onChange',
		},
	});

	useEffect(() => {
		window.localStorage.removeItem('seconds');
		window.localStorage.removeItem('conditionReset');
	}, []);

	useEffect(() => {
		setEmail(window.localStorage.getItem('email'));
	}, []);

	const password = watch('password');

	const onSubmit = async (values) => {
		try {
			setErrMessage('');
			const fields = {
				values,
				email,
			};
			const { data } = await axios.post('/newpassword', fields);
			window.localStorage.removeItem('email');
			window.localStorage.removeItem('conditionReset');
			setCondition(true);
		} catch (err) {
			console.warn(err);
			let errMes = err.response.data.message;
			if (errMes) {
				setErrMessage('*' + `${errMes}`);
			}
		}
	};

	return (
		<div>
			{
				condition ? (
					<div className="success__pass">
						<SuccessRegister title="Пароль успешно восстановлен" />
					</div>
				) : (
					<div className="reset__container">
						<div className="reset">
							<form onSubmit={handleSubmit(onSubmit)} className="form">
								<h3 className="form__title">Ввод нового пароля</h3>
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
												message: '*Пароль должен содержать минимум 8 символов',
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
												message: '*Пароль должен содержать минимум 8 символов',
											},
											validate: (value) =>
												value === password ||
												'*Пароль не соответствует паролю выше',
										})}
									/>
									<label for="repPass" className="label">
										Повторите пароль
									</label>
									<p className="error">{errors.repPass?.message}</p>
									<p className="error">{errMessage}</p>
								</div>

								<button type="submit" className="btn">
									Сменить пароль
								</button>
							</form>
						</div>
					</div>
				)
			}
		</div>
	)
};

export default NewPass;