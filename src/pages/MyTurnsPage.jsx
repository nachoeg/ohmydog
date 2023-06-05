import { useContext } from 'react';
import TablaTurnos from '../components/TablaTurnos';
import { Button, Container } from '@mui/material';
import { Context } from '../context/Context';
import { NavLink } from 'react-router-dom';
import { Add } from '@mui/icons-material';

function MyTurnsPage() {
	const { usuario } = useContext(Context);

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
				<TablaTurnos idUsuario={usuario.id} />
				<NavLink
					to="/mis-turnos/solicitar-turno"
					style={{ textDecoration: 'none', width: '100%' }}
				>
					<Button
						startIcon={<Add />}
						sx={{ mt: 2, width: '100%' }}
						variant="contained"
					>
						Solicitar turno
					</Button>
				</NavLink>
			</Container>
		</>
	);
}

export default MyTurnsPage;
