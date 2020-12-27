import { useUsersQuery } from '../generated/graphql';

interface Props {}

const Home: React.FC<Props> = () => {
	const { data } = useUsersQuery({ fetchPolicy: 'network-only' });

	if (!data) {
		return <div>loading...</div>;
	}

	return (
		<div>
			<div>users</div>
			<ul>
				{data.users.map((x) => {
					return (
						<li key={x.id}>
							{x.id} - {x.email}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Home;
