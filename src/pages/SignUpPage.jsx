import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import Container, { containerClasses } from '@mui/material/Container';
import { Alert, MenuItem } from '@mui/material';
import url from '../data/url';
import { useState } from 'react';
import emailjs from 'emailjs-com';

export default function SignUp() {
	const [snackbar, setSnackbar] = useState(null);

	const handleCloseSnackbar = () => setSnackbar(null);

	// Funcion para enviar el email con la contraseña temporal
	function sendEmail(e, p) {
		e.preventDefault();
		e.target.elements.password.value = p; // Almacena la contraseña temporal en el formulario para enviarla
		emailjs.sendForm('service_xg4z6nu', 'template_xjzci4t', e.target, 'kMhWmQA84AfcGvqNF')
		  .then((result) => {
			console.log(result.text);
		  }, (error) => {
			setSnackbar({
				children: 'Error al conectar con la base de datos' + error,
				severity: 'error',
			});
		  });
	}

	// Genera una constraseña aleatoria
	const generarContraseña = () => {
		const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
		const longitud = 10;
		let contraseña = '';
	
		for (let i = 0; i < longitud; i++) {
		  const indice = Math.floor(Math.random() * caracteres.length);
		  contraseña += caracteres.charAt(indice);
		}
		console.log(contraseña);
		return contraseña;
	};
	
	// Aca estan las lineas que hay que descomentar y comentar, son 2 que hay que descomentar y 1 que comentar.
	const handleSubmit = (event) => {
		event.preventDefault();
		// DESCOMENTAR const temporalPassword = generarContraseña(); // Genera la contraseña aleatoria
		const temporalPassword = 1; // COMENTAR
		const data = new FormData(event.currentTarget);
		const token = localStorage.getItem('jwt');
		fetch(url + 'usuarios/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
			credentials: 'include',
			mode: 'cors',
			body: JSON.stringify({
				email: data.get('email'),
				password: temporalPassword,
				nombre: data.get('nombre'),
				apellido: data.get('apellido'),
				dni: data.get('dni'),
				localidad: data.get('localidad'),
				direccion: data.get('direccion'),
				telefono: data.get('telefono'),
				rol: data.get('rol'),
			}),
		})
			.then((response) => {
				if (response.ok) {
					// DESCOMENTAR sendEmail(event, temporalPassword); // Envia al mail la contraseña temporal
					setSnackbar({
						children: 'Registro exitoso',
						severity: 'success',
					});
					setTimeout(() => {
						location.replace('/usuarios');
					}, 1000);
				}
				if (response.status == 400) {
					setSnackbar({
						children: 'El email ingresado ya se encuentra registrado',
						severity: 'error',
					});
				}
				if (response.status == 403) {
					setSnackbar({
						children: 'El DNI ingresado ya se encuentra registrado',
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
				<Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Registrar usuario
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="given-name"
								name="nombre"
								required
								fullWidth
								id="nombre"
								label="Nombre"
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id="apellido"
								label="Apellido"
								name="apellido"
								autoComplete="family-name"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="email"
								label="Correo electrónico"
								name="email"
								autoComplete="email"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								type="number"
								name="dni"
								label="Dni"
								id="dni"
								autoComplete="dni"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								name="direccion"
								label="Direccion"
								id="address"
								autoComplete="street-address"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								name="localidad"
								label="Localidad"
								id="localidad"
								autoComplete="country-name"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								type="number"
								name="telefono"
								label="Telefono"
								id="telefono"
								autoComplete="tel"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="rol"
								select
								required
								fullWidth
								name="rol"
								label="Rol"
								defaultValue="cliente"
							>
								<MenuItem key={'cliente'} value={'cliente'}>
									Cliente
								</MenuItem>
								<MenuItem key={'veterinario'} value={'veterinario'}>
									Veterinario
								</MenuItem>
							</TextField>
						</Grid>
						<Grid item xs={12} display='none'>
							<TextField
								fullWidth // Este campo se usa para enviar la contraseña temporal por email
								type="password"
								name="password"
								label="password"
								id="password"
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
