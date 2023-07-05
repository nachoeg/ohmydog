import { Container } from '@mui/material';
import TarjetaPerro from '../components/TarjetaPerro';

function LostDogsPage() {
	let perros = [
		{
			nombre: 'Titan',
			idDuenio: '2',
			imagen: '/perro1.jpeg',
			fecha: '08/05/2023',
			zona: 'Plaza Italia',
			email: 'pedro@email.com',
		},
		{
			nombre: 'Kala',
			idDuenio: '-1',
			imagen: '/perro2.jpg',
			fecha: '08/05/2023',
			zona: 'Plaza Italia',
			email: 'pedro@email.com',
		},
		{
			nombre: 'Kala',
			idDuenio: '-1',
			imagen: '/perro3.jpeg',
			fecha: '08/05/2023',
			zona: 'Plaza Italia',
			email: 'pedro@email.com',
		},
	];
	return (
		<Container
			component="main"
			maxWidth="sm"
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				mt: 4,
				gap: 2,
			}}
		>
			{perros.map((perro) => (
				<TarjetaPerro datos={perro} key={perro.id} />
			))}
		</Container>
	);
}

export default LostDogsPage;
