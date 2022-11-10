import jwt from 'jsonwebtoken';

//проверяет можно ли возвращать какую-лтбо информаицю или нет

export default (req, res, next) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

	if (token) {
		//если токен есть, то мы его должны расшифровать
		try {
			const decoded = jwt.verify(token, 'secret123');

			req.userId = decoded._id;
			next();//если токен расшифровался и сохранился, то выполняем некст, что значитт все норм иди дальше
		} catch (err) {
			return res.status(403).json({
				message: 'Нет доступа',
			})
		}
	} else {
		return res.status(403).json({
			message: 'Нет доступа',
		})
	}
};