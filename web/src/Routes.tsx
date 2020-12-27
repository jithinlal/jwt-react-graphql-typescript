import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function Routes() {
	return (
		<BrowserRouter>
			<div>
				<header>
					<div>
						<Link to='/'>Home</Link>
					</div>
					<div>
						<Link to='/register'>Register</Link>
					</div>
					<div>
						<Link to='/login'>Login</Link>
					</div>
				</header>
				<Switch>
					<Route path='/' exact component={Home}></Route>
					<Route path='/login' component={Login}></Route>
					<Route path='/register' component={Register}></Route>
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default Routes;
