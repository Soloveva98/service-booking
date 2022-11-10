import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "..//..//..//axios";
import s from './ChangePass.module.scss';

function ChangePass({ userId, activateSuccess }) {

	const [errMessage, setErrMessage] = useState('');

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			oldPass: '',
			newPass: '',
			repNewPass: '',
			mode: 'onChange',
		},
	});

	const password = watch('newPass');

	const onSubmit = async (values) => {
		try {
			setErrMessage('');
			const id = userId;
			const { data } = await axios.post(`/changepass/${id}`, values);
			activateSuccess();
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
			<form onSubmit={handleSubmit(onSubmit)} className="form">
				<div className={s.input__container}>
					<input
						className={s.input}
						type="password"
						name="oldPass"
						placeholder="input"
						style={{ borderColor: errors.oldPass && 'red' }}
						{...register('oldPass', {
							required: '*Введите старый пароль',
							minLength: {
								value: 8,
								message: '*Минимум 8 символов',
							},
						})}
					/>
					<label for="pass" className={s.label}>
						Старый пароль
					</label>
					<p className={s.error}>{errors.oldPass?.message}</p>
				</div>

				<div className={s.input__container}>
					<input
						className={s.input}
						type="password"
						name="newPass"
						placeholder="input"
						style={{ borderColor: errors.newPass && 'red' }}
						{...register('newPass', {
							required: '*Введите новый пароль',
							minLength: {
								value: 8,
								message: '*Минимум 8 символов',
							},
						})}
					/>
					<label for="pass" className={s.label}>
						Новый пароль
					</label>
					<p className={s.error}>{errors.newPass?.message}</p>
				</div>

				<div className={s.input__container}>
					<input
						className={s.input}
						type="password"
						name="repNewPass"
						placeholder="input"
						onPaste={(e) => {
							e.preventDefault();
							return false;
						}}
						style={{ borderColor: errors.repNewPass && 'red' }}
						{...register('repNewPass', {
							required: '*Повторите новый пароль',
							minLength: {
								value: 8,
								message: '*Минимум 8 символов',
							},
							validate: (value) =>
								value === password ||
								'*Не соответствует паролю выше',
						})}
					/>
					<label for="repPass" className={s.label}>
						Повторите новый пароль
					</label>
					<p className={s.error}>{errors.repNewPass?.message}</p>
					<p className={s.error}>{errMessage}</p>
				</div>

				<button type="submit">
					Сменить пароль
				</button>
			</form>
		</div>
	)
}

export default ChangePass;
