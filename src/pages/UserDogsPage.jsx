import AddIcon from '@mui/icons-material/Add';
import { Container, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import TablaPerros from '../components/TablaPerros';
import { useLocation } from 'react-router-dom'; // Para obtener el parametro pasado por la url

function UserDogsPage() {
	// Obtiene el id del usuario que se pasa como parametro en la url
	const location = useLocation();
	const idUsuario = location.pathname.split('/')[2];
	const nombre = location.pathname.split('/')[3];

	return (
		<Container
			component="main"
			maxWidth="lg"
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				mt: 2,
			}}
		>
			<Typography
				component="h1"
				variant="h6"
				autoCapitalize
				sx={{
					mb: 2,
				}}
			>
				PERROS DE {nombre.toUpperCase()}
			</Typography>
			<TablaPerros idUsuario={idUsuario} />
			<NavLink
				to={`/agregarperro/${idUsuario}`}
				style={{ textDecoration: 'none', width: '100%' }}
			>
				<Button
					startIcon={<AddIcon />}
					sx={{ mt: 2, width: '100%' }}
					variant="contained"
				>
					Registrar perro
				</Button>
			</NavLink>
		</Container>
	);
}

export default UserDogsPage;
