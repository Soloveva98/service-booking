import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "..//..//axios";
import CheckPinCode from "./CheckPinCode/CheckPinCode";

function ResetPass() {

	const [conditionSubmut, setConditionSubmit] = useState(false);
	const [errMessage, setErrMessage] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: '',
			mode: 'onChange',
		},
	});

	useEffect(() => {
		setConditionSubmit(JSON.parse(window.localStorage.getItem('conditionReset')));
	}, []);

	useEffect(() => {
		window.localStorage.setItem('conditionReset', conditionSubmut);
	}, [conditionSubmut]);


	const onSubmit = async (values) => {
		try {
			setErrMessage('');
			const { data } = await axios.post(`/resetpassword`, values);
			setConditionSubmit(true);
			window.localStorage.setItem('email', values.email);

		} catch (err) {
			console.warn(err);
			let errEmail = err.response.data.message;
			if (errEmail) {
				setErrMessage('*' + `${errEmail}`);
			}
		}
	};


	return (
		<div className="reset__container">
			<div className="reset">
				{
					!conditionSubmut ? (
						<form onSubmit={handleSubmit(onSubmit)} className="form">
							<h3 className="form__title">Восстановление пароля</h3>
							<div className="input__container">
								<input
									className="input"
									type="email"
									name="email"
									style={{ borderColor: errors.email && 'red' }}
									{...register('email', {
										required: '*Введите адрес электронной почты',
									})}
								/>
								<label for="email" className="label">
									E-mail
								</label>
								<p className="error">{errors.email?.message}</p>
								<p className="error">{errMessage}</p>
							</div>
							<button type="submit" className="btn">
								Отправить код
							</button>
						</form>
					) : (
						<CheckPinCode setConditionSubmit={setConditionSubmit} />
					)
				}
			</div>
		</div>
	)
}


export default ResetPass;