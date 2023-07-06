import { Alert, Button, Container, Snackbar, Typography } from '@mui/material';
import TarjetaPerro from '../components/TarjetaPerro';
import { useEffect, useState } from 'react';
import url from '../data/url';
import { Add } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

function LostDogsPage() {
	const [perros, setPerros] = useState([]);

	useEffect(() => {
		obtenerPerros().then((perros) => setPerros(perros));
	}, []);

	const [vacia, setVacia] = useState(false);
	async function obtenerPerros() {
		try {
			const response = await fetch(url + 'perdidos', {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!response.ok) {
				setSnackbar({
					children: 'Hubo un error al intentar cargar los perros perdidos',
					severity: 'error',
				});
				return [];
			}
			let perros = await response.json();
			if (perros.length == 0) {
				setSnackbar({
					children: 'La lista de perros se encuentra vacia',
					severity: 'info',
				});
				setVacia(true);
			}
			return perros;
		} catch (error) {
			console.error('Error en el fetch: ' + error);

			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
			return [];
		}
	}

	// let perros = [
	// 	{
	// 		nombre: 'Titan',
	// 		idDuenio: '2',
	// 		imagen: '/perro1.jpeg',
	// 		fecha: '08/05/2023',
	// 		zona: 'Plaza Italia',
	// 		email: 'pedro@email.com',
	// 	},
	// 	{
	// 		nombre: 'Kala',
	// 		idDuenio: '-1',
	// 		imagen: '/perro2.jpg',
	// 		fecha: '08/05/2023',
	// 		zona: 'Plaza Italia',
	// 		email: 'pedro@email.com',
	// 	},
	// 	{
	// 		nombre: 'Kala',
	// 		idDuenio: '-1',
	// 		imagen: '/perro3.jpeg',
	// 		fecha: '08/05/2023',
	// 		zona: 'Plaza Italia',
	// 		email: 'pedro@email.com',
	// 	},
	// ];

	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

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
			<Button
				component={NavLink}
				to={'/perdidos/registrar'}
				startIcon={<Add />}
				variant="contained"
				fullWidth
			>
				Cargar perro
			</Button>
			{perros.map((perro) => (
				<TarjetaPerro datos={perro} key={perro.id} />
			))}
			{!!snackbar && (
				<Snackbar
					open
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					onClose={handleCloseSnackbar}
					autoHideDuration={6000}
				>
					<Alert {...snackbar} onClose={handleCloseSnackbar} />
				</Snackbar>
			)}
			{vacia && (
				<>
					<Typography variant="h6"> No hay perros perdidos cargados</Typography>
					<img
						style={{
							maxHeight: '50vh',
							maxWidth: '50vw',
						}}
						src="/good-dog.svg"
						alt="Foto de veterinario"
					/>
				</>
			)}
		</Container>
	);
}

export default LostDogsPage;
