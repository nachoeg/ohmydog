import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import EventIcon from '@mui/icons-material/Event';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert, MenuItem } from '@mui/material';
import url from '../data/url';
import motivoTurnos from '../data/motivoTurnos';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../context/Context';

export default function AddTurn() {
	const { usuario } = useContext(Context);
	const token = localStorage.getItem('jwt');

	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	const [perros, setPerros] = useState([]);

	useEffect(() => {
		obtenerPerros().then((p) => setPerros(p));
	}, []);

	function obtenerPerros() {
		return fetch(url + 'perros/' + usuario.id, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
		})
			.then((response) => {
				console.log(response);
				if (response.ok) {
					return response.json();
				} else {
					if (response.status == 401) {
						setSnackbar({
							children: 'No estas autorizado para ver los perros',
							severity: 'error',
						});
					}
					return [];
				}
			})
			.catch((error) => {
				console.error('Error en el fetch: ' + error);

				setSnackbar({
					children: 'Error al conectar con la base de datos',
					severity: 'error',
				});
				return [];
			});
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const token = localStorage.getItem('jwt');
		fetch(url + 'turnos/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
			credentials: 'include',
			mode: 'cors',
			body: JSON.stringify({
				idPerro: data.get('perros'),
				fecha: data.get('fecha'),
				motivo: data.get('motivo'),
			}),
		})
			.then((response) => {
				if (response.ok) {
					setSnackbar({
						children: 'Solicitud exitosa. Verifique el estado de su turno en el perfil del perrito a atender.',
						severity: 'success',
					});
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

	const hoy = new Date().toISOString().split('T')[0];

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
					<EventIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Solicitar turno
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								select
								id="perros"
								name="perros"
								label="Perro"
								defaultValue={''}
							>
								{perros.map((perro) => (
									<MenuItem value={perro.id} key={perro.id}>
										{perro.nombre}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								type="date"
								id="fecha"
								label="Fecha"
								name="fecha"
								defaultValue={hoy}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="motivo"
								select
								required
								fullWidth
								name="motivo"
								label="Motivo"
								defaultValue="Consulta General"
							>
								{motivoTurnos.map((motivo) => (
									<MenuItem value={motivo} key={motivo}>
										{motivo}
									</MenuItem>
								))}
							</TextField>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Solicitar turno
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
