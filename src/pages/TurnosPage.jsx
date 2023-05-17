import AddIcon from '@mui/icons-material/Add';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import TablaTurnos from '../components/TablaTurnos';

function TurnosPage() {
	return (
		<Container
			component="main"
			maxWidth="lg"
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				mt: 4,
			}}
		>
			<TablaTurnos />
			<NavLink to="/signup" style={{ textDecoration: 'none', width: '100%' }}>
				<Button
					startIcon={<AddIcon />}
					sx={{ mt: 2, width: '100%' }}
					variant="contained"
				>
					Solicitar Turno
				</Button>
			</NavLink>
		</Container>
	);
}

export default TurnosPage;