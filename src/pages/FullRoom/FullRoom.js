import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "..//..//axios";
import Room from '..//..//components/Room/Room';

function FullRoom() {

	const [data, setData] = useState();

	const { id } = useParams();
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		axios.get(`/rooms/${id}`)
			.then(res => {
				setData(res.data);
				setLoading(false);
			})
			.catch(err => {
				console.warn(err);
				alert('Ошибка при получении карточки помещения');
			});
	}, []);

	if (isLoading) {
		return <Room isLoading={isLoading} />
	}

	return (
		<>
			<Room
				id={data._id}
				type={data.type}
				img={data.photos}
				moreImg={data.morePhoto}
				title={data.title}
				price={data.price}
				square={data.square}
				address={data.address}
				description={data.description}
				numberPhone={data.numberPhone} />
		</>
	)
}

export default FullRoom;