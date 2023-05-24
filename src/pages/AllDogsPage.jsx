import { Container } from '@mui/material';
import TablaPerros from '../components/TablaPerros';

// La tabla de perros recibe en props el id del usuario que va a mostrar los perros
function AllDogsPage() {
	return (
		<Container
			component="main"
			maxWidth="md"
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				mt: 4,
			}}
		>
			<TablaPerros idUsuario={''} />
		</Container>
	);
}

export default AllDogsPage;
