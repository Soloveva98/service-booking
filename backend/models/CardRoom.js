import mongoose from "mongoose";

//необходимо создать схему нашей таблицы
const CardRoomSchema = new mongoose.Schema({//все свойства, которые есть у помещения
	type: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	square: {
		type: Number,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	photos: {
		type: Array,
		default: [],
		required: true,
	}
},
	{
		timestamps: true,//схема должна при создании пользователя автоматически прикрепить время и дату создания этой сущности
	},
);

export default mongoose.model('CardRoom', CardRoomSchema);

