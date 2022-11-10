import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuth } from "../../redux/slices/auth";
import Account from '../../components/Account/Account';


function FullAccount() {
	const isAuth = useSelector(selectIsAuth);

	const { auth } = useSelector(state => state);
	const isUserLoading = auth.status === 'loading';


	if (!window.localStorage.getItem('token')) {
		return <Navigate to="/" />
	}

	return (
		<div>
			{
				isUserLoading ? (
					<></>
				) : (
					<Account userInfo={auth.data} />
				)
			}
		</div>
	)
}

export default FullAccount;