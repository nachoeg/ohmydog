import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, MenuItem } from "@mui/material";
import { useState } from "react";
import url from "../data/url";

function RegistrarPaseadorCuidador() {
	const token = localStorage.getItem("jwt"); // Se obtiene el token del admin

	// Se declara una snackbar para mostrar mensajes
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	const handleSubmit = (event) => {
		event.preventDefault(); // Se elimina las acciones default del formulario

		// Almacena la informacion del formulario, currentTarget hace referencia al formulario actual
		const data = new FormData(event.currentTarget);

		// En funcion del tipo realiza el fetch con la BD.
		registrarPaseadorCuidador(data);
	};

	const registrarPaseadorCuidador = (data) => {
		// Se realiza el fetch con la BD y se manda en el cuerpo del mensaje los datos del formulario
		// Datos de los paseadores/cuidadores: Nombre, apellido, dni, telefono, email y zona.
		fetch(url + "paseador/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
			credentials: "include",
			mode: "cors",
			body: JSON.stringify({
				nombre: data.get("nombre"),
				apellido: data.get("apellido"),
				dni: data.get("dni"),
				telefono: data.get("telefono"),
				email: data.get("email"),
				zona: data.get("zona"),
				tipo: data.get("tipo"),
			}),
		})
			.then((response) => {
				if (response.ok) {
					setSnackbar({
						children: "Registro exitoso.",
						severity: "success",
					});
					setTimeout(() => {
						window.location.replace("/paseadores-cuidadores");
					}, 1000);
				} else {
					setSnackbar({
						children: "Error al conectar con la base de datos",
						severity: "error",
					});
				}
			})
			.catch((error) => {
				setSnackbar({
					children: "Error al conectar con la base de datos",
					severity: "error",
				});
				console.error(error);
			});
	};

	// Datos de las campañas: Nombre, apellido, DNI, telefono, mail y zona.
	// Y un tipo para distinguirlos.
	return (
		<Container component='main' maxWidth='xs'>
			<Box
				sx={{
					marginTop: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography component='h1' variant='h5'>
					Registrar paseador/cuidador
				</Typography>

				<Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<TextField
								id='tipo'
								name='tipo'
								label='Voy a registrar un...'
								select
								required
								fullWidth
								defaultValue='Paseador'
							>
								<MenuItem key={"paseador"} value={"Paseador"}>
									Paseador
								</MenuItem>
								<MenuItem key={"cuidador"} value={"Cuidador"}>
									Cuidador
								</MenuItem>
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								name='nombre'
								required
								fullWidth
								id='nombre'
								label='Nombre'
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label='Apellido'
								required
								fullWidth
								id='apellido'
								name='apellido'
								variant='outlined'
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								name='dni'
								required
								fullWidth
								id='dni'
								label='DNI'
								type='number'
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								name='telefono'
								label='Telefono'
								id='telefono'
								type='number'
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								name='email'
								label='Email'
								id='email'
								type='email'
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								required
								name='zona'
								label='Zona'
								id='zona'
							/>
						</Grid>
					</Grid>

					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
					>
						Registrar
					</Button>
					{!!snackbar && (
						<Snackbar
							open
							anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

export default RegistrarPaseadorCuidador;
