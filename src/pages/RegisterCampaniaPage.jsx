import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert, MenuItem } from '@mui/material';
import { useState } from 'react';
import url from '../data/url';

function RegisterCampaniaPage() {
	const token = localStorage.getItem('jwt'); // Se obtiene el token del admin

	// Se declara una snackbar para mostrar mensajes
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	// Manejador del boton submit del formulario
	const handleSubmit = (event) => {
		event.preventDefault(); // Se elimina las acciones default del formulario
		// Almacena la informacion del formulario, currentTarget hace referencia al formulario actual
		const data = new FormData(event.currentTarget);
		// Se realiza el fetch con la BD y se manda en el cuerpo del mensaje los datos del formulario
		// Datos de las campanias: nombre, motivo, cvu, telefono, mail, fecha inicio, fecha fin.
		fetch(url + 'campanias/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
			credentials: 'include',
			mode: 'cors',
			body: JSON.stringify({
				nombre: data.get('nombre'),
				motivo: data.get('motivo'),
				cvu: data.get('cvu'),
				telefono: data.get('telefono'),
				email: data.get('email'),
				fechaInicio: data.get('fechaInicio'),
				fechaFin: data.get('fechaFin'),
			}),
		})
			.then((response) => {
				if (response.ok) {
					setSnackbar({
						children: 'Registro exitoso.',
						severity: 'success',
					});
					setTimeout(() => {
						window.location.replace('/campanias/');
					}, 1000);
				} else {
					setSnackbar({
						children: 'Error al conectar con la base de datos',
						severity: 'error',
					});
				}
			})
			.catch((error) => {
				setSnackbar({
					children: 'Error al conectar con la base de datos',
					severity: 'error',
				});
				console.error(error);
			});
	};

	// Variables para no permitir piquear fechas anteriores a hoy.
	const today = new Date();
	const formattedToday = today.toISOString().split('T')[0];

	// Datos de las campañas: Fecha de inicio, fecha de fin, nombre, motivo, telefono, mail, CVU/CBU para realizar las donaciones.
	// Fecha de fin debe ser opcional.
	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 4,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Typography component="h1" variant="h5">
					Registrar campaña
				</Typography>

				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<TextField
								name="nombre"
								required
								fullWidth
								id="nombre"
								label="Nombre de campaña"
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant="h7" sx={{ mr: '20px' }}>
								Fecha de inicio *
							</Typography>
							<TextField
								required
								fullWidth
								id="fechaInicio"
								name="fechaInicio"
								type="date"
								variant="outlined"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant="h7" sx={{ mr: '20px' }}>
								Fecha de fin
							</Typography>
							<TextField
								fullWidth
								id="fechaFin"
								name="fechaFin"
								type="date"
								variant="outlined"
								inputProps={{ min: formattedToday }}
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								name="motivo"
								required
								fullWidth
								id="motivo"
								label="Motivo"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								name="telefono"
								label="Telefono"
								id="telefono"
								type="number"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								name="email"
								label="Email"
								id="email"
								type="email"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								name="cvu"
								label="CVU/CBU"
								id="cvu"
								type="number"
							/>
						</Grid>
					</Grid>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Registrar
					</Button>
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
				</Box>
			</Box>
		</Container>
	);
}

export default RegisterCampaniaPage;
