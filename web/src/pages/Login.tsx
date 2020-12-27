import { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useLoginMutation } from '../generated/graphql';

const Login: React.FC<RouteComponentProps> = ({ history }) => {
	const [email, setEmail] = useState('initialState');
	const [password, setPassword] = useState('');
	const [login] = useLoginMutation();

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				const response = await login({
					variables: {
						email,
						password,
					},
				});
				history.push('/');
			}}
		>
			<div>
				<input
					value={email}
					placeholder='email'
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
			</div>
			<div>
				<input
					value={password}
					placeholder='password'
					type='password'
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
			</div>
			<button type='submit'>Login</button>
		</form>
	);
};

export default Login;
