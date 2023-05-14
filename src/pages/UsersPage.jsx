import AddIcon from '@mui/icons-material/Add';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import url from '../data/url';

function UsersPage() {
	const token = localStorage.getItem('jwt');
	fetch(url + 'usuarios', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`,
		},
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Error en la solicitud fetch');
			}
		})
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.error('Error en el fetch: ' + error);
		});

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
