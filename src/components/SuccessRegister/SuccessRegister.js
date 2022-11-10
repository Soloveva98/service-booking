import React from "react";
import { Link } from "react-router-dom";
import s from './SuccessRegister.module.scss';


function SuccessRegister({title}) {

	return (
		<div className={s.success}>
			<img src="/images/icons/success.svg" width='60px' />
			<h3>{title}</h3>
			<p>Для полноценного использования сайта</p>
			<Link to="/login">
				<button>авторизуйтесь</button>
			</Link>
		</div>
	)
};

export default SuccessRegister;