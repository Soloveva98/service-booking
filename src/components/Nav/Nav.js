import React from "react";
import s from "./Nav.module.scss";

function Nav({ filters, onSelectFilter }) {

	return (
		<div className={s.nav__items}>
			<button onClick={onSelectFilter} className={s.nav__item}>{filters[0]}</button>
			<button onClick={onSelectFilter} className={s.nav__item}>{filters[1]}</button>
			<button onClick={onSelectFilter} className={s.nav__item}>{filters[2]}</button>
			<button onClick={onSelectFilter} className={s.nav__item}>{filters[3]}</button>
		</div>
	)
}

export default Nav;