import AddIcon from '@mui/icons-material/Add';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import TablaUsuarios from '../components/TablaUsuarios';

function UsersPage() {
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
			<TablaUsuarios />
			<NavLink
				to="/usuarios/registrar"
				style={{ textDecoration: 'none', width: '100%' }}
			>
				<Button
					startIcon={<AddIcon />}
					sx={{ mt: 2, width: '100%' }}
					variant="contained"
				>
					Registrar Usuario
				</Button>
			</NavLink>
		</Container>
	);
}

export default UsersPage;
