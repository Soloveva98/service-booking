import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";
import s from './Account.module.scss';
import ChangePass from "./ChangePass/ChangePass";


function Account({ userInfo }) {

	const isAuth = useSelector(selectIsAuth);

	const [editMode, setEditMode] = useState(false);

	const [name, setName] = useState(userInfo.name);
	const [email, setEmail] = useState(userInfo.email);
	const [number, setNumber] = useState(userInfo.number);
	const [condition, setCondition] = useState(false);
	const [conditionPass, setConditionPass] = useState(false);

	useEffect(() => {
		setConditionPass(JSON.parse(window.localStorage.getItem('conditionPass')));
	}, []);

	useEffect(() => {
		window.localStorage.setItem('conditionPass', conditionPass);
	}, [conditionPass]);

	const activateEditMode = () => {
		setEditMode(true);
	};

	const deActivateEditMode = () => {
		setEditMode(false);
	};

	const onChangePass = () => {
		setConditionPass(true);
		window.localStorage.setItem('conditionPass', conditionPass);
	};

	const deactivateChangePass = () => {
		setConditionPass(false);
		window.localStorage.removeItem('conditionPass');
	};

	const activateSuccess = () => {
		setConditionPass(false);
		setCondition(true);
	};


	const onSubmit = async () => {
		try {
			const id = userInfo._id;
			const fields = {
				name,
				email,
				number
			};
			setEditMode(false);
			const { data } = await axios.post(`/users/${id}`, fields);
		} catch (err) {
			console.warn(err);
		}
	};

	return (
		<div className={s.account}>
			<div className="container">
				<div className={s.account__inner}>
					<div className={s.account__info}>
						<h3>Общая информация</h3>

						{
							!editMode ?
								(
									<>
										<div className={s.account__name}>
											<span>Имя: </span>
											{name}
										</div>
										<div className={s.account__email}>
											<span>E-mail: </span>
											{email}
										</div>
										<div className={s.account__phone}>
											<span>Телефон: </span>
											{number}
										</div>
										<button onClick={activateEditMode}>Редактировать</button>
									</>
								) : (
									<>
										<div className={s.account__name}>
											<span>Имя: </span>
											<input onChange={(e) => setName(e.target.value)} autoFocus={true} value={name} className={s.account__input} />
										</div>
										<div className={s.account__email}>
											<span>E-mail: </span>
											<input onChange={(e) => setEmail(e.target.value)} autoFocus={true} value={email} className={s.account__input} />
										</div>
										<div className={s.account__phone}>
											<span>Телефон: </span>
											<input onChange={(e) => setNumber(e.target.value)} autoFocus={true} value={number} className={s.account__input} />
										</div>
										<button onClick={onSubmit}>Сохранить</button>
										<button onClick={deActivateEditMode} >Отменить</button>
									</>
								)
						}

					</div>
					<div className={s.account__pass}>
						<h3>Смена пароля</h3>
						{
							condition ? (
								<div className={s.success}>
									<img src="/images/icons/success.svg" width='60px' />
									<p>Пароль успешно изменен</p>
								</div>
							) : (
								!conditionPass ? (
									<button onClick={onChangePass}>Сменить пароль</button>
								) : (
									<div className={s.change__pass}>
										<ChangePass userId={userInfo._id} activateSuccess={activateSuccess} />
										<button onClick={deactivateChangePass} className={s.btn__deactivate}>Отменить</button>
									</div>
								)
							)
						}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Account;