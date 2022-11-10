import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "..//..//axios";
import s from "./Catalog.module.scss";
import SliderMain from "../SliderMain/SliderMain";
import CardRoom from "../CardRoom/CardRoom";
import Nav from "../Nav/Nav";
import Filters from "../Filters/Filters";
import { fetchRooms } from "../../redux/slices/rooms";


function Catalog() {
	const [filter, setFilter] = useState("Все варианты");
	const [priceFrom, setPriceFrom] = useState();
	const [priceTo, setPriceTo] = useState();
	const [squareFrom, setSquareFrom] = useState();
	const [squareTo, setSquareTo] = useState();

	const dispatch = useDispatch();
	const { rooms } = useSelector(state => state.rooms);

	const isRoomsLoading = rooms.status === 'loading';

	useEffect(() => {
		dispatch(fetchRooms());
	}, []);


	function onSelectFilter(event) {
		setFilter((filter) => (filter = event.target.innerText))
	};

	function onSelectFilterPriceFrom(event) {
		setPriceFrom((priceFrom) => (priceFrom = event.target.value))
	};

	function onSelectFilterPriceTo(event) {
		setPriceTo((priceTo) => (priceTo = event.target.value))
	};

	function onSelectFilterSquareFrom(event) {
		setSquareFrom((squareFrom) => (squareFrom = event.target.value))
	};

	function onSelectFilterSquareTo(event) {
		setSquareTo((squareTo) => (squareTo = event.target.value))
	};

	//функция фильтрации квартир по виду
	function filterRooms(filter, arr) {
		let allCards = arr;
		let hotelCards = arr.filter(item => item.type === "Гостиничные номера");
		let flatCards = arr.filter(item => item.type === "Квартиры");
		let roomCards = arr.filter(item => item.type === "Комнаты");

		if (filter === "Все варианты") {
			return allCards;
		} else if (filter === "Гостиничные номера") {
			return hotelCards;
		} else if (filter === "Квартиры") {
			return flatCards;
		} else if (filter === "Комнаты") {
			return roomCards;
		}
	};

	//функция фильтрации по прайсу
	function filterPriceRooms(arr) {
		if (priceFrom && priceTo) {
			let priceRooms = arr.filter(item => (item.price >= priceFrom && item.price <= priceTo));
			return priceRooms;
		} else if (priceFrom) {
			let priceRooms = arr.filter(item => (item.price >= priceFrom));
			return priceRooms;
		} else if (priceTo) {
			let priceRooms = arr.filter(item => (item.price <= priceTo));
			return priceRooms;
		} else {
			return arr;
		}
	};

	//функция фильтрации по площади
	function filterSquareRooms(arr) {
		if (squareFrom && squareTo) {
			let squareRooms = arr.filter(item => (item.square >= squareFrom && item.square <= squareTo));
			return squareRooms;
		} else if (squareFrom) {
			let squareRooms = arr.filter(item => (item.square >= squareFrom));
			return squareRooms;
		} else if (squareTo) {
			let squareRooms = arr.filter(item => (item.square <= squareTo));
			return squareRooms;
		} else {
			return arr;
		}
	};

	//функция показа отфильтрованных квартир
	function showCardRooms(filter, arr) {
		return (
			filterPriceRooms(
				filterSquareRooms(
					filterRooms(filter, arr)
				)
			)
		);
	};

	const mainPhotos = rooms.items.map((obj) => {
		return obj.photos[0];
	});


	return (
		<div className={s.catalog__inner}>
			<div className={s.catalog__nav}>
				<Nav
					filters={["Все варианты", "Гостиничные номера", "Квартиры", "Комнаты"]}
					onSelectFilter={onSelectFilter} />
			</div>
			<div className={s.catalog__filters}>
				<Filters
					onSelectFilterPriceFrom={onSelectFilterPriceFrom}
					onSelectFilterPriceTo={onSelectFilterPriceTo}
					onSelectFilterSquareFrom={onSelectFilterSquareFrom}
					onSelectFilterSquareTo={onSelectFilterSquareTo} />
			</div>
			<div className={s.catalog__slider}>
				<SliderMain photos={mainPhotos} />
			</div>
			<div className={s.catalog__items}>
				{
					(isRoomsLoading ? [...Array(5)] : showCardRooms(filter, rooms.items)).map((obj, index) =>
						isRoomsLoading ? (
							<CardRoom key={index} isLoading={true} />
						) : (
							<CardRoom
								id={obj._id}
								type={obj.type}
								img={obj.photos[0]}
								title={obj.title}
								price={obj.price}
								preview={obj.preview}
								square={obj.square}
								address={obj.address} />
						)
					)
				}
			</div>
		</div>
	)
}

export default Catalog;