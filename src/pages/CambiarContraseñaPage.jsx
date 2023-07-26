import { Password, Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Alert,
	Avatar,
	Box,
	Button,
	Container,
	FormControl,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Snackbar,
	Typography,
} from '@mui/material';
import url from '../data/url';
import { useState } from 'react';

function ChangePassword() {
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	const [showPasswordOld, setShowPasswordOld] = useState(false);
	const [showPasswordNew, setShowPasswordNew] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const handleClickShowPasswordOld = () => setShowPasswordOld((show) => !show);
	const handleClickShowPasswordNew = () => setShowPasswordNew((show) => !show);
	const handleClickShowPasswordConfirm = () =>
		setShowPasswordConfirm((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const token = localStorage.getItem('jwt');
	const usuario = JSON.parse(localStorage.getItem('usuario'));

	function validarDatos(datos) {
		return (
			datos.get('newPassword').toString().trim() != '' &&
			datos.get('oldPassword').toString().trim() != '' &&
			datos.get('confirmPassword').toString().trim() != ''
		);
	}
	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		if (data.get('newPassword') != data.get('confirmPassword')) {
			setSnackbar({
				children: 'Las contraseñas nuevas no coinciden',
				severity: 'error',
			});
			return;
		}
		if (data.get('oldPassword') == data.get('newPassword')) {
			setSnackbar({
				children: 'La contraseña nueva debe ser distinta a la anterior',
				severity: 'error',
			});
			return;
		}
		if (!validarDatos(data)) {
			setSnackbar({
				children: 'No puede ingresar una contraseña vacia.',
				severity: 'error',
			});
			return;
		}
		const response = await fetch(
			url + 'usuarios/changePassword/' + usuario.id,
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					token: `${token}`,
				},
				body: JSON.stringify({
					contrasenaVieja: data.get('oldPassword'),
					contrasenaNueva: data.get('newPassword'),
					contrasenaConfirmacion: data.get('confirmPassword'),
				}),
			}
		);
		if (response.ok) {
			const nuevoUsuario = { ...usuario, password: data.get('newPassword') };
			localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
			setSnackbar({
				children: 'Modificación realizada con éxito',
				severity: 'success',
			});
			setTimeout(() => {
				location.replace('/perfil/' + usuario.id);
			}, 1000);
			return;
		}
		if (response.status == 400) {
			setSnackbar({
				children: 'La contraseña ingresada es incorrecta. Intentalo de nuevo',
				severity: 'error',
			});
			return;
		}
		setSnackbar({
			children: 'Error al conectar con la base de datos',
			severity: 'error',
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
				<Avatar sx={{ m: 1, bgcolor: 'tertiary.main' }}>
					<Password />
				</Avatar>
				<Typography component="h1" variant="h5">
					Cambiar contraseña
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<FormControl required fullWidth variant="outlined">
								<InputLabel htmlFor="oldPassword">
									Contraseña anterior
								</InputLabel>
								<OutlinedInput
									autoFocus
									id="oldPassword"
									name="oldPassword"
									type={showPasswordOld ? 'text' : 'password'}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPasswordOld}
												onMouseDown={handleMouseDownPassword}
												edge="end"
											>
												{showPasswordOld ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
									label="Contraseña anterior"
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl required fullWidth variant="outlined">
								<InputLabel htmlFor="newPassword">Contraseña nueva</InputLabel>
								<OutlinedInput
									id="newPassword"
									name="newPassword"
									type={showPasswordNew ? 'text' : 'password'}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPasswordNew}
												onMouseDown={handleMouseDownPassword}
												edge="end"
											>
												{showPasswordNew ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
									label="Contraseña nueva"
								/>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl required fullWidth variant="outlined">
								<InputLabel htmlFor="confirmPassword">
									Confirmar contraseña
								</InputLabel>
								<OutlinedInput
									id="confirmPassword"
									name="confirmPassword"
									type={showPasswordConfirm ? 'text' : 'password'}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPasswordConfirm}
												onMouseDown={handleMouseDownPassword}
												edge="end"
											>
												{showPasswordConfirm ? (
													<VisibilityOff />
												) : (
													<Visibility />
												)}
											</IconButton>
										</InputAdornment>
									}
									label="Confirmar contraseña"
								/>
							</FormControl>
						</Grid>
					</Grid>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Cambiar
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

export default ChangePassword;
