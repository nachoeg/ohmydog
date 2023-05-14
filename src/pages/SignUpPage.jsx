import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { MenuItem } from '@mui/material';
import { url } from '../data/url';

export default function SignUp() {
	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const token = localStorage.getItem('jwt');
		fetch(url + 'usuarios/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `${token}`,
			},
			mode: 'cors',
			body: JSON.stringify({
				email: data.get('email'),
				password: data.get('password'),
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
					console.log('registro exitoso');
				} else {
					throw new Error('Error en la solicitud fetch');
				}
			})
			.catch((error) => {
				console.error(error);
			});
		// console.log(
		// 	JSON.stringify({
		// 		token: localStorage.getItem('jwt'),
		// 		email: data.get('email'),
		// 		password: data.get('password'),
		// 		nombre: data.get('nombre'),
		// 		apellido: data.get('apellido'),
		// 		dni: data.get('dni'),
		// 		localidad: data.get('localidad'),
		// 		direccion: data.get('direccion'),
		// 		telefono: data.get('telefono'),
		// 		rol: data.get('rol'),
		// 	})
		// );
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
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
								name="password"
								label="Contraseña"
								type="password"
								id="password"
								autoComplete="new-password"
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
								name="telefono"
								label="Telefono"
								id="telefono"
								autoComplete="tel"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="dni"
								label="Dni"
								id="dni"
								autoComplete="dni"
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
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Registrar
					</Button>
					{/* <Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="#" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid> */}
				</Box>
			</Box>
		</Container>
	);
}
