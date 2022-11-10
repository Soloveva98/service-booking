import React from "react";
import s from "./SliderMain.module.scss";
import Slider from "react-slick";

function SliderMain({ photos }) {

	const settings = {
		dots: false,
		arrows: false,
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		speed: 5000,
		autoplaySpeed: 1000,
		cssEase: "linear",
		responsive: [
			{
				breakpoint: 900,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 454,
				settings: {
					slidesToShow: 2,
				}
			},
		]
	};

	if (!photos) {
		return null;
	}

	return (
		<div className={s.slider__inner}>
			<Slider {...settings}>
				{
					photos.map((item, index) => {
						return (
							<div key={index}>
								<img src={item} />
							</div>
						)
					})
				}
			</Slider>
		</div>
	)
}

export default SliderMain;
