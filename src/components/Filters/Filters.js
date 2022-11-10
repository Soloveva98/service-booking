import React from "react";
import s from "./Filters.module.scss";

function Filters({ onSelectFilterPriceFrom, onSelectFilterPriceTo, onSelectFilterSquareFrom, onSelectFilterSquareTo }) {
	return (
		<div className={s.filters__inner}>
			<div className={s.filters__item}>
				<p className={s.filter}>Цена</p>
				<div className={s.input}>
					<div>
						<input type="text" onChange={onSelectFilterPriceFrom} placeholder="От" />
						--
						<input type="text" onChange={onSelectFilterPriceTo} placeholder="До" />
					</div>
				</div>
			</div>
			<div className={s.filters__item}>
				<p className={s.filter}>Площадь</p>
				<div className={s.input}>
					<div>
						<input type="text" onChange={onSelectFilterSquareFrom} placeholder="От" />
						--
						<input type="text" onChange={onSelectFilterSquareTo} placeholder="До" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Filters;