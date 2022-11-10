import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import s from './Room.module.scss';
import { selectIsAuth } from "../../redux/slices/auth";



function Room({ type, img, title, price, square, address, description, numberPhone }) {

	const isAuth = useSelector(selectIsAuth);
	const settings = {
		customPaging: function (i) {
			return (
				<a>
					<img src={img[i]} style={{ width: "60px", height: "80px", objectFit: "contain" }} />
				</a>
			);
		},
		dots: true,
		dotsClass: "slick-dots slick-thumb",
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 595,
				settings: {
					dots: false,
				}
			}
		]
	};

	function onShowNumber(e) {
		e.target.innerHTML = numberPhone;
	};

	if (!img) {
		return null;
	}

	return (
		<div className={s.room}>
			<div className="container">
				<div className={s.room__inner}>
					<div className={s.room__slider}>

						<Slider {...settings}>
							{
								img.map((item, index) => {
									return (
										<div key={index}>
											<img src={item} className={s.room__img} style={{ objectFit: "contain" }} />
										</div>
									)
								})
							}
						</Slider>

					</div>
					<div className={s.room__info}>
						<div className={s.room__header}>
							<p>{title}</p>
							{
								!(type === "Гостиничные номера") ?
									(
										<p>
											{price} р./месяц
										</p>
									) : (
										<p>
											{price} р./сутки
										</p>
									)
							}
						</div>
						<div className={s.room__characteristics}>
							<p>{address}</p>
							<p>{square} кв.м.</p>
						</div>

						<p className={s.room__description}>{description}</p>

						{isAuth ? (
							<div className={s.room__contact}>
								<span>Связаться с владельцем</span>
								<button onClick={onShowNumber}>Показать номер</button>
							</div>
						) : (
							<div className={s.room__contact}>
								<span>Чтобы связаться с арендодателем, авторизуйтесь</span>
								<Link to={'/login'} className={s.room__login}><button>авторизация</button></Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Room;