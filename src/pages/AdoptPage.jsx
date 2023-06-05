import { Button, Container } from '@mui/material';
import TablaAdopcion from '../components/TablaAdopcion';
import { NavLink } from 'react-router-dom';
import { Context } from '../context/Context';
import { Add } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';

function AdoptPage() {
	const { usuario } = useContext(Context);
	const [cliente, setCliente] = useState('');
	useEffect(() => {
		if (usuario) setCliente(usuario.rol == 'cliente');
	}, [usuario]);

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
			{cliente && (
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
			)}
		</Container>
	);
}

export default AdoptPage;
