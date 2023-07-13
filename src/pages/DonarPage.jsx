import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, MenuItem } from "@mui/material";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import url from "../data/url";
import { useLocation } from "react-router-dom"; // Para obtener el parametro pasado por la url

function DonarPage() {
	// Obtiene el nombre de la campaña que se pasa como parametro en la url
	// Se reemplazan los %20 por espacios.
	const location = useLocation();
	const nombreCampania = location.pathname.split("/")[3];
	const nombreCampaniaConEspacios = nombreCampania.replace(/%20/g, " ");

	const token = localStorage.getItem("jwt");

	// Se declara una snackbar para mostrar mensajes
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	// Funcion que comprueba las tarjetas ingresadas.
	function comprobarTarjeta(tarjetaIngresada) {
		const tarjetaMatias = {
			nombre: "Matias Perez",
			numero: 4523750661886537,
			cvv: 8798,
			vencimiento: "2027-12",
		};
		const tarjetaMartina = {
			nombre: "Martina Ruiz",
			numero: 4587635283679854,
			cvv: 6572,
			vencimiento: "2025-12",
		};
		const tarjetaSebastian = {
			nombre: "Sebastian Pascal",
			numero: 5538671259043428,
			cvv: 6788,
			vencimiento: "2028-12",
		};

		// Recorta año y mes de la tarjeta para compararlas.
		const partes = tarjetaIngresada.vencimiento.split("-");
		const parteAComparar = partes.slice(0, 2).join("-");

		if (
			tarjetaIngresada.nombre == tarjetaMatias.nombre &&
			tarjetaIngresada.numero == tarjetaMatias.numero &&
			tarjetaIngresada.cvv == tarjetaMatias.cvv &&
			parteAComparar == tarjetaMatias.vencimiento
		) {
			setSnackbar({
				children:
					"Donacion a " + nombreCampaniaConEspacios + " realizada. Gracias!",
				severity: "success",
			});
			return true;
		} else if (
			tarjetaIngresada.nombre == tarjetaMartina.nombre &&
			tarjetaIngresada.numero == tarjetaMartina.numero &&
			tarjetaIngresada.cvv == tarjetaMartina.cvv &&
			parteAComparar == tarjetaMartina.vencimiento
		) {
			setSnackbar({
				children:
					"Donacion a " + nombreCampaniaConEspacios + " realizada. Gracias!",
				severity: "success",
			});
			return true;
		} else if (
			tarjetaIngresada.nombre == tarjetaSebastian.nombre &&
			tarjetaIngresada.numero == tarjetaSebastian.numero &&
			tarjetaIngresada.cvv == tarjetaSebastian.cvv &&
			parteAComparar == tarjetaSebastian.vencimiento
		) {
			setSnackbar({
				children: "Tarjeta con fondos insuficientes.",
				severity: "error",
			});
		} else {
			setSnackbar({
				children: "Los datos de la tarjeta son invalidos.",
				severity: "error",
			});
		}
		return false;
	}

	const agregarDniADescuentos = async (dni) => {
		console.log(dni);
		const response = await fetch(url + "bouchers/agregarBoucher/" + dni, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
			body: JSON.stringify(""),
		});
		if (response.status == 500) {
			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
		}
	};

	// Manejador del boton submit del formulario
	const handleSubmit = (event) => {
		event.preventDefault(); // Se elimina las acciones default del formulario
		// Almacena la informacion del formulario, currentTarget hace referencia al formulario actual
		const data = new FormData(event.currentTarget);

		const tarjetaIngresada = {
			numero: data.get("numeroTarjeta"),
			nombre: data.get("nombre"),
			cvv: data.get("cvv"),
			vencimiento: data.get("fechaVencimiento"),
		};

		if (comprobarTarjeta(tarjetaIngresada)) {
			agregarDniADescuentos(data.get("dni"));
			setTimeout(() => {
				window.location.replace("/campanias");
			}, 1500);
		}
	};

	// Variables para marcar/desmarcar el anonimato en donacion
	const [isChecked, setIsChecked] = useState(false);
	const handleCheckboxChange = (event) => {
		setIsChecked(event.target.checked);
	};

	// Para configurar que solo puedan seleccionarse meses y años en el vencimiento de tarjeta
	const handleTextFieldFocus = (event) => {
		event.target.type = "month";
	};
	const hoy = new Date().toISOString().split("T")[0];
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
					Donar a {nombreCampaniaConEspacios}
				</Typography>
				<Typography
					variant='body1'
					component='h1'
					style={{ marginTop: "10px" }}
				>
					Ingrese los datos de la tarjeta
				</Typography>
				<Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<TextField
								name='nombre'
								required
								fullWidth
								id='nombre'
								label='Nombre del titular (tal cual figura en la tarjeta)'
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								name='numeroTarjeta'
								required
								fullWidth
								id='numeroTarjeta'
								label='Numero de tarjeta'
								type='number'
							/>
						</Grid>
						{!isChecked ? (
							<Grid item xs={12} sm={12}>
								<TextField
									name='dni'
									required
									fullWidth
									id='dni'
									label='DNI'
									type='number'
								/>
								<Typography
									variant='body2'
									component='h1'
									style={{ marginLeft: "10px" }}
								>
									(Por tu donación, acercandote a nuestra veterinaria con tu DNI
									obtendras un 20% de descuento en tu compra)
								</Typography>
							</Grid>
						) : null}

						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								label='Fecha de vencimiento'
								id='fechaVencimiento'
								name='fechaVencimiento'
								type='date'
								defaultValue={hoy}
								variant='outlined'
								onFocus={handleTextFieldFocus}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label='CVV'
								fullWidth
								id='cvv'
								name='cvv'
								type='number'
								variant='outlined'
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								name='cantidadDonacion'
								required
								fullWidth
								id='cantidadDonacion'
								label='Cantidad a donar ($)'
								type='number'
								inputProps={{
									min: 1,
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<Checkbox
								checked={isChecked}
								onChange={handleCheckboxChange}
								color='primary'
							/>
							<Typography variant='h7' sx={{ mr: "0px" }} disabled={!isChecked}>
								Donar de manera anónima
							</Typography>
							{isChecked ? (
								<Typography
									variant='body2'
									component='h1'
									style={{ marginTop: "-1px" }}
								>
									(la donación se hará bajo el pseudónimo "Anónimo")
								</Typography>
							) : null}
						</Grid>
					</Grid>
					<Typography
						variant='body2'
						component='h1'
						style={{ marginTop: "10px" }}
					>
						Desde Oh My Dog! te queríamos contar que además de donar, existen
						miles de maneras de ayudar a las campañas o perreras de la ciudad.
						Si quieres saber cuáles son, comunícate con nosotros al 2213037453.
					</Typography>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
						color={"success"}
					>
						Donar
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

export default DonarPage;
