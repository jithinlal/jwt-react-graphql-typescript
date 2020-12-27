import { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRegisterMutation } from '../generated/graphql';

const Register: React.FC<RouteComponentProps> = ({ history }) => {
	const [email, setEmail] = useState('initialState');
	const [password, setPassword] = useState('');
	const [register] = useRegisterMutation();

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				const response = await register({
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
			<button type='submit'>Register</button>
		</form>
	);
};

export default Register;
