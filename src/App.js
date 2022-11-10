import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import FullRoom from './pages/FullRoom/FullRoom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Footer from './components/Footer/Footer';
import FullAccount from './pages/FullAccount/FullAccount';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import ResetPass from './pages/ResetPass/ResetPass';
import NewPass from './pages/ResetPass/NewPass/NewPass';


function App() {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);

	useEffect(() => {
		dispatch(fetchAuthMe());
	}, []);


	return (
		<div className="App">
			<div className='header'>
				<Header />
			</div>
			<div className='main'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/rooms/:id' element={<FullRoom />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route path='/account' element={<FullAccount />} />
					<Route path='/reset' element={<ResetPass />} />
					<Route path='/resetpassword' element={<NewPass />} />
				</Routes>
			</div>
			<div className='footer'>
				<Footer />
			</div>
		</div>
	);
}

export default App;