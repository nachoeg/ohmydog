import AddIcon from '@mui/icons-material/Add';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

function UsersPage() {
	return (
		<Container
			component="main"
			maxWidth="xs"
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<NavLink to="/signup" style={{ textDecoration: 'none' }}>
				<Button startIcon={<AddIcon />} sx={{ mt: 2 }} variant="contained">
					Crear Usuario
				</Button>
			</NavLink>
		</Container>
	);
}

export default UsersPage;
