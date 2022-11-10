import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "..//..//..//axios";
import { Navigate } from "react-router-dom";


function CheckPinCode({ setConditionSubmit }) {
	const [conditionNavigate, setConditionNavigate] = useState(false);
	const [errMessage, setErrMessage] = useState('');
	const [email, setEmail] = useState('');
	const currentSeconds = window.localStorage.getItem('seconds');
	const [seconds, setSeconds] = useState(currentSeconds || 60);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			pin: '',
			mode: 'onChange',
		},
	});

	useEffect(() => {
		const timer = seconds > 0 && setInterval(() => setSeconds(seconds - 1), 1000);
		window.localStorage.setItem('seconds', seconds);
		if (seconds === 0) {
			window.localStorage.removeItem('seconds');
			return setConditionSubmit(false);
		}
		return () => clearInterval(timer);
	}, [seconds]);

	useEffect(() => {
		setEmail(window.localStorage.getItem('email'));
	}, []);

	const onSubmit = async (values) => {
		try {
			setErrMessage('');
			const fields = {
				values,
				email,
			};
			const { data } = await axios.post('/reset/pin', fields);
			setConditionNavigate(true);
		} catch (err) {
			console.warn(err);
			let errPin = err.response.data.message;
			if (errPin) {
				setErrMessage('*' + `${errPin}`);
			}
		}
	};

	return (
		<div>
			{
				!conditionNavigate ? (
					<form onSubmit={handleSubmit(onSubmit)} className="form">
						<h3 className="form__title">Введите пин-код</h3>
						<p className="success">На вашу почту было отправлено письмо с пин-кодом. Проверьте почту и введите пин-код из письма.</p>
						<p className="success">Запросить повторный код можно через <span>{seconds}</span> секунд</p>
						<div className="input__container">
							<input
								className="input"
								type="text"
								name="pin"
								style={{ borderColor: errors.email && 'red' }}
								{...register('pin', {
									required: '*Введите пин-код',
									minLength: {
										value: 6,
										message: 'Пин-код содержит 6 цифр',
									},
									maxLength: {
										value: 6,
										message: 'Пин-код содержит 6 цифр',
									}
								})}
							/>
							<label for="pin" className="label">
								Пин-код
							</label>
							<p className="error">{errors.pin?.message}</p>
							<p className="error">{errMessage}</p>
						</div>
						<button type="submit" className="btn">
							Проверить
						</button>
					</form>
				) : (
					<Navigate to='/resetpassword' />
				)
			}

		</div>
	)
};

export default CheckPinCode;