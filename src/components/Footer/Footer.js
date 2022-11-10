import React from "react";
import s from "./Footer.module.scss";

function Footer() {
	return (
		<section className={s.footer}>

			<div className={s.footer__inner}>
				<span>© 2022 Copyright</span>
				<span className={s.footer__phone}>+7-777-777-7777</span>
				<span className={s.footer__mail}>bron@mail.ru</span>
				<div className={s.footer__pay}>
					<img src="/images/card/pay_visa.svg" width={40} />
					<img src="/images/card/pay_mastercard.svg" width={40} />
					<img src="/images/card/pay_mir.svg" width={40} />
				</div>
			</div>

		</section>
	)
}

export default Footer;