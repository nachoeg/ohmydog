import { Container } from "@mui/material";
import { useLocation } from "react-router-dom"; // Para obtener el parametro pasado por la url
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Alert } from "@mui/material";
import url from "../data/url";
import emailjs from "emailjs-com";
import { useEffect, useState } from "react";

function GetDataForAdoptPage() {
	// Obtiene el id del perro que se pasa como parametro en la url
	const location = useLocation();
	const idPerro = location.pathname.split("/")[2];

	const token = localStorage.getItem("jwt");

	// Declaracion de snackbar para mostrar mensajes.
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	// Perro que se solicita adoptar
	const [perro, setPerro] = useState(obtenerPerro);

	// Asigna a perro el perro obtenido de la BD.
	useEffect(() => {
		obtenerPerro().then((perro) => setPerro(perro));
	}, [idPerro]);

	// Obtiene el perro a adoptar de la BD mediante su ID.
	async function obtenerPerro() {
		try {
			const response = await fetch(url + "adopciones/" + idPerro, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					token: `${token}`,
				},
			});
			let dog = await response.json();
			if (dog == null) {
				setSnackbar({
					children: "No se encontro al perro",
					severity: "error",
				});
			}
			console.log(dog);
			return dog;
		} catch (error) {
			console.error("Error en el fetch: " + error);
			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
			return null;
		}
	}

	function sendEmail(e) {
		// "Crea" un formulario ya que la API necesita que los datos se envien en uno
		e.preventDefault();

		// Agrega campos al formulario recien creado
		// En el template de la API se utiliza el "name" de los campos para referenciar los valores
		// dentro del cuerpo del email. En value van los valores que se quiere enviar a la API.
		// Se van a enviar nombrePersona, apellidoPersona y telefonoPersona de la persona que quiere adoptar
		// Y tambien nombrePerro y mail del perro a adoptar (el mail es al que le llega el correo)

		// Datos del perro que esta siendo adoptado:
		const nombrePerroInput = document.createElement("input");
		nombrePerroInput.name = "nombrePerro";
		nombrePerroInput.value = perro.nombre;
		nombrePerroInput.style.display = "none"; // Ocultar el campo de entrada
		e.target.appendChild(nombrePerroInput);

		// Email al que llega el correo
		const direccionEmail = document.createElement("input");
		direccionEmail.name = "email";
		direccionEmail.value = perro.email;
		direccionEmail.style.display = "none"; // Ocultar el campo de entrada
		e.target.appendChild(direccionEmail);

		// URL para confirmar la adopcion
		const urlConfirmar = document.createElement("input");
		urlConfirmar.name = "urlConfirmar";
		urlConfirmar.value = "http://localhost:5173/confirmar-adopcion/" + idPerro;
		urlConfirmar.style.display = "none"; // Ocultar el campo de entrada
		e.target.appendChild(urlConfirmar);

		emailjs
			.sendForm(
				"service_t777hj8",
				"template_cfj9d0o",
				e.target,
				"kMhWmQA84AfcGvqNF"
			)
			.then(
				(result) => {
					console.log(result.text);
				},
				(error) => {
					setSnackbar({
						children: "Error al enviar el email" + error,
						severity: "error",
					});
				}
			);
	}

	// Enviar mail con los datos.
	// DESCOMENTAR ACA!!
	const handleSubmit = (event) => {
		event.preventDefault();
		sendEmail(event); // DESCOMENTAR
		setSnackbar({
			children: "Solicitud enviada con exito.",
			severity: "success",
		});
		setTimeout(() => {
			window.location.replace("/adopcion");
		}, 1000);
	};

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
					Enviar solicitud para adoptar a {perro.nombre}
				</Typography>
				<Typography component='h2' variant='h6'>
					Ingrese sus datos personales
				</Typography>

				<Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete='given-name'
								name='nombrePersona'
								required
								fullWidth
								id='nombre'
								label='Nombre'
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id='apellido'
								label='Apellido'
								name='apellidoPersona'
								autoComplete='family-name'
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id='email'
								label='Correo electrónico'
								name='email'
								autoComplete='email'
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								type='number'
								name='telefonoPersona'
								label='Telefono'
								id='telefono'
								autoComplete='tel'
							/>
						</Grid>
					</Grid>
					<Typography component='h6' variant='caption'>
						(*Los datos que proporcione se enviaran a la persona que publico a{" "}
						{perro.nombre} para que se ponga en contacto con usted.)
					</Typography>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
					>
						Enviar solicitud
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

export default GetDataForAdoptPage;
