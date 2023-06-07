import { Container } from '@mui/material';
import TablaTurnos from '../components/TablaTurnos';
import { useLocation } from 'react-router-dom';

function DogsUsersTurnsPage() {
	const location = useLocation();
	const url =
		location.pathname.split('/')[2] + '/' + location.pathname.split('/')[3];

	return (
		<>
			<Container
				component="main"
				maxWidth="sm"
				sx={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					mt: 4,
				}}
			>
				<TablaTurnos urlTurnos={url} />
			</Container>
		</>
	);
}

export default DogsUsersTurnsPage;
