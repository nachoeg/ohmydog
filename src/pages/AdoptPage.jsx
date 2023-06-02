import { Button, Container } from '@mui/material';
import TablaAdopcion from '../components/TablaAdopcion';
import { NavLink } from 'react-router-dom';
import { Add } from '@mui/icons-material';

function AdoptPage() {
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
			<TablaAdopcion />
			<NavLink
				to="/adopcion/registrar"
				style={{ textDecoration: 'none', width: '100%' }}
			>
				<Button
					startIcon={<Add />}
					sx={{ mt: 2, width: '100%' }}
					variant="contained"
				>
					Registrar perro para adopción
				</Button>
			</NavLink>
		</Container>
	);
}

export default AdoptPage;
