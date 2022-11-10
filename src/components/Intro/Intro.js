import React from "react";
import s from "./Intro.module.scss";

function Intro() {
	return (
		<section className={s.intro}>
			<div className="container">
				<div className={s.intro__inner}>
					<h1 className={s.intro__title}>Бронирование гостиничных номеров,<br /> квартир и комнат</h1>
				</div>
			</div>
		</section>
	)
}

export default Intro;