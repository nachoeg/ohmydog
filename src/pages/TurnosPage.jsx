import { Container } from '@mui/material';
import TablaTurnos from '../components/TablaTurnos';

function TurnosPage() {
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
				<TablaTurnos idUsuario="" />
			</Container>
		</>
	);
}

export default TurnosPage;
