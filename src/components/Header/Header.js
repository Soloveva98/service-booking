import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, selectIsAuth } from "../../redux/slices/auth";

import s from "./Header.module.scss";

function Header() {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);

	const onLogout = () => {
		dispatch(logout());
		window.localStorage.removeItem('token');
	};

	return (
		<section className={s.header}>
			<div className="container">
				<div className={s.header__inner}>
					<Link to="/" className={s.header__logo}>
						<img src="/images/logo/7.svg" width={40} />
					</Link>
					<div className={s.header__contacts}>
						<p>Тел: 8-777-777-7777</p>
						<p>Тел: 8-983-765-5432</p>
						<p>bron@mail.ru</p>
					</div>
					<div className={s.header__login}>
						{isAuth ? (
							<div className={s.header__icons}>
								<Link to="/account">
									<button className={s.header__icon}>
										<img src="/images/icons/user_check.svg" width={30} />
									</button>
								</Link>
								<div className={s.header__slash}></div>
								<Link to="/">
									<button onClick={onLogout} className={s.header__icon}>
										<img src="/images/icons/exit.svg" width={24} />
									</button>
								</Link>
							</div>
						) : (
							<div className={s.header__icons}>
								<Link to="/login">
									<button className={s.header__icon}>
										<img src="/images/icons/login.svg" width={30} />
									</button>
								</Link>

								<div className={s.header__slash}></div>

								<Link to='/register'>
									<button className={s.header__icon}>
										<img src="/images/icons/reg.svg" width={32} />
									</button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}

export default Header;