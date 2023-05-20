import { Container } from '@mui/material';
import TablaTurnos from '../components/TablaTurnos';
import { useContext } from 'react';
import { Context } from '../context/Context';
import AddTurn from '../components/AddTurn';

function TurnosPage() {
	const { usuario } = useContext(Context);

	return (
		<>
			{usuario.rol == 'veterinario' ? (
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
					<TablaTurnos />
				</Container>
			) : (
				<AddTurn />
			)}
		</>
	);
}

export default TurnosPage;
