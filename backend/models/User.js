import mongoose from "mongoose";

//необходимо создать схему нашей таблицы
const UserSchema = new mongoose.Schema({//все свойства, которые есть у пользователя
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	number: {
		type: String,
		required: true,
		unique: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	pin: {
		type: String,
	}
},
	{
		timestamps: true,//схема должрна при создании пользователя автоматически прикрепить время и дату создания этой сущности
	},
);

export default mongoose.model('User', UserSchema);