import React, { useEffect } from "react";
import s from './Home.module.scss';
import Intro from "../../components/Intro/Intro";
import Catalog from '..//../components/Catalog/Catalog';



function Home() {
	useEffect(() => {
		window.localStorage.removeItem('seconds');
		window.localStorage.removeItem('conditionReset');
		window.localStorage.removeItem('email');
	}, []);

	return (
		<section className={s.home}>
			<div className="container">
				<Intro />
				<div className={s.home__inner}>
					<div className={s.catalog}>
						<Catalog />
					</div>
				</div>
			</div>
		</section>
	)
}

export default Home;