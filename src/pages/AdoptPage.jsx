import { Button, Container } from '@mui/material';
import TablaAdopcion from '../components/TablaAdopcion';
import { NavLink } from 'react-router-dom';
import { Context } from '../context/Context';
import { Add } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';

function AdoptPage() {
	const { usuario } = useContext(Context);
	const [noVeterinario, setNoVeterinario] = useState('');
	useEffect(() => {
		if (usuario) setNoVeterinario(usuario.rol != 'veterinario');
		else setNoVeterinario(true);
	}, [usuario]);

	return (
		<Container
			component="main"
			maxWidth="xl"
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				mt: 4,
			}}
		>
			<TablaAdopcion />
			{noVeterinario && (
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
