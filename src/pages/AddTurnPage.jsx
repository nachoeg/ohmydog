import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert, MenuItem } from '@mui/material';
import url from '../data/url';
import { useState } from 'react';

export default function AddTurn() {
	const [snackbar, setSnackbar] = useState(null);

	const handleCloseSnackbar = () => setSnackbar(null);

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
			    idPerro: data.get('idPerro'),
				fecha: data.get('fecha'),
				motivo: data.get('motivo'),
			}),
		})
			.then((response) => {
				if (response.ok) {
					setSnackbar({
						children: 'Registro exitoso',
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
					Solicitar turno
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
					    <Grid item xs={12} sm={6}>
                    		<TextField
                    		    required
                    			fullWidth
                    		    id="idPerro"
                    			label="Perro"
                    			name="idPerro"
                    			autoComplete="perro"
                    			/>
                    	</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id="fecha"
								label="Fecha"
								name="Fecha"
								autoComplete="family-name"
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
								defaultValue="consulta"
							>
								<MenuItem key={'consulta'} value={'Consulta General'}>
									Consulta General
								</MenuItem>
								<MenuItem key={'castracion'} value={'Castracion'}>
									Castracion
								</MenuItem>
								<MenuItem key={'antirrabica'} value={'Vacuna Antirrabica'}>
                                	Vacuna Antirrabica
                                </MenuItem>
                                <MenuItem key={'antienfermedades'} value={'Vacuna Antienfermedades'}>
                                   Vacuna Antienfermedades
                                </MenuItem>
                                <MenuItem key={'desparasitacion'} value={'Desparasitacion'}>
                                    Desparasitacion
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