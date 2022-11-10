import React from "react";
import { Link } from "react-router-dom";
import s from './CardRoom.module.scss';


function CardRoom({ id, type, img, title, price, preview, square, address }) {
	return (
		<div className={s.card}>
			<Link to={`/rooms/${id}`} className={s.card__img}>
				<img src={img} />
			</Link>
			<div className={s.card__info}>
				<Link to={`/rooms/${id}`} className={s.card__title}>
					{title}
				</Link>
				{
					!(type === "Гостиничные номера") ?
						(
							<div className={s.card__price}>
								{price} р./месяц
							</div>
						) : (
							<div className={s.card__price}>
								{price} р./сутки
							</div>
						)
				}
				<div className={s.card__preview}>{preview}</div>
				<div className={s.card__square}>{square} кв.м.</div>
				<div className={s.card__address}>{address}</div>
			</div>
		</div>
	)
}

export default CardRoom;