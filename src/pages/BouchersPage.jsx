import { Container } from "@mui/material";
import { useEffect, useState, useCallback, useContext } from "react";
import { Context } from "../context/Context";
import { Button } from "@mui/material";
import url from "../data/url";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Card, List, Typography, ListItem, TextField } from "@mui/material";

function BouchersPage() {
	// Declaracion de snackbar para mostrar mensajes.
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	const { usuario } = useContext(Context);
	const token = localStorage.getItem("jwt");

	const [esVeterinario, setEsVeterinario] = useState(false); // Para ocultar o mostrar funciones de veterinarios

	//Habilita/muestra opciones en funcion de si entra un veterinario.
	useEffect(() => {
		if (usuario != null && usuario.rol === "veterinario") {
			setEsVeterinario(true);
		}
	}, [usuario]);

	const handleSubmit = async (event) => {
		event.preventDefault(); // Saca las acciones por defecto del submit
		const data = new FormData(event.currentTarget);
		const dni = data.get("dni");
		const response = await fetch(url + "bouchers/quemarBoucher/" + dni, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
			body: JSON.stringify(""),
		});
		if (response.ok) {
			setSnackbar({
				children: "El descuento fue comprobado con exito",
				severity: "success",
			});
			setTimeout(() => {
				window.location.replace("/campanias");
			}, 1500);
		} else {
			if (response.status == 500) {
				setSnackbar({
					children: "Error al conectar con la base de datos",
					severity: "error",
				});
			} else {
				setSnackbar({
					children: "No se encontro el dni en el registro de descuentos",
					severity: "error",
				});
			}
		}
	};

	return (
		<Container
			component="main"
			maxWidth="lg"
			sx={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				mt: 4,
			}}
		>
			<Card sx={{ padding: "10px", marginTop: 4 }}>
				<Typography variant="h5">Buscar cupón de descuento</Typography>
				<Typography variant="body2" component="h1">
					(Los cupones de descuento tienen un solo uso*)
				</Typography>
				<List component="form" onSubmit={handleSubmit}>
					<ListItem>
						<TextField
							fullWidth
							name="dni"
							id="dni"
							label="DNI"
							variant="outlined"
							size="small"
							type="text"
						/>
					</ListItem>

					<Button
						fullWidth
						color="primary"
						variant="contained"
						type="submit"
						style={{ marginTop: "10px" }}
					>
						Validar descuento
					</Button>
				</List>
			</Card>

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
		</Container>
	);
}

export default BouchersPage;
