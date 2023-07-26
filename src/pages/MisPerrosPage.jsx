import { Container } from '@mui/material';
import TablaPerros from '../components/TablaPerros';
import { Context } from '../context/Context';
import { useContext } from 'react';

function MyDogsPage() {
	const { usuario } = useContext(Context); // Usuario que accede a la pagina

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
			<TablaPerros idUsuario={usuario.id} />
		</Container>
	);
}

export default MyDogsPage;
