import CardRoomModel from "../models/CardRoom.js";

//получение всех карточек помещений
export const getAll = async (req, res) => {
	try {
		const rooms = await CardRoomModel.find();

		res.json(rooms);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось получить карточки помещений'
		});
	}
};

//получение одной карточки помещения
export const getOne = async (req, res) => {
	try {
		const roomId = req.params.id;

		const roomOne = await CardRoomModel.findOne({
			_id: roomId,
		});

		if (!roomOne) {
			res.status(404).json({
				message: 'Карточка помещения не найдена'
			})
		}

		res.json(roomOne);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось получить карточку помещения'
		});
	}
};
