import AddIcon from '@mui/icons-material/Add';
import { Avatar, Chip, Container } from '@mui/material';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import TablaPerros from '../components/TablaPerros';
import { useLocation } from 'react-router-dom'; // Para obtener el parametro pasado por la url
import { Pets } from '@mui/icons-material';

function UserDogsPage() {
	// Obtiene el id del usuario que se pasa como parametro en la url
	const location = useLocation();
	const idUsuario = location.pathname.split('/')[2];
	const nombreCompleto = location.pathname.split('/')[3];
	const nombre = nombreCompleto.split('-')[0];
	const apellido = nombreCompleto.split('-')[1];

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
			<Chip
				avatar={
					<Avatar sx={{ p: 2 }}>
						<Pets />
					</Avatar>
				}
				variant="outlined"
				label={nombre + ' ' + apellido}
				sx={{
					mb: 1,
					fontSize: 20,
					// fontWeight: 'bold',
					py: 2.5,
					px: 0,
					borderRadius: 100,
				}}
			/>
			<TablaPerros idUsuario={idUsuario} />
			<NavLink
				to={`/agregarperro/${idUsuario}/${nombreCompleto}`}
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
