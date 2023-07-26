import { Container } from "@mui/material";
import { useLocation } from "react-router-dom"; // Para obtener el parametro pasado por la url
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import { Alert } from "@mui/material";
import url from "../data/url";

import { useEffect, useState } from "react";

function ConfirmAdoptPage() {
	// Obtiene el id del perro que se pasa como parametro en la url
	const location = useLocation();
	const idPerro = location.pathname.split("/")[3];

	const token = localStorage.getItem("jwt");

	// Declaracion de snackbar para mostrar mensajes.
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	// Perro que se solicita adoptar
	const [perro, setPerro] = useState({ nombre: "..." });

	// Asigna a perro el perro obtenido de la BD.
	useEffect(() => {
		obtenerPerro().then((perro) => setPerro(perro));
	}, [idPerro]);

	// Obtiene el perro a confirmar adopcion de la BD.
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
			return { nombre: "..." };
		}
	}

	// Envia la confirmacion de adocion a la BD.
	const handleConfirmarAdopcion = async () => {
		const response = await fetch(url + "adopciones/adoptar/" + idPerro, {
			method: "put",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
		});
		if (response.ok) {
			setSnackbar({
				children: "Se marco como adoptado correctamente.",
				severity: "success",
			});
			setTimeout(() => {
				window.location.replace("/adopciones");
			}, 1000);
		}
		if (response.status == 500) {
			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
		}
	};

	//Manejador de eliminacion
	const handleConfirmarEliminar = async () => {
		console.log(perro);
		const response = await fetch(url + "adopciones/delete/" + idPerro, {
			method: "delete",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
		});
		if (response.ok) {
			setSnackbar({
				children: "Se elimino de la base de datos.",
				severity: "success",
			});
			setTimeout(() => {
				window.location.replace("/adopciones");
			}, 1000);
		}
		if (response.status == 500) {
			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
		}
	};

	return (
		<Container
			component="main"
			maxWidth="xs"
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography component="h3" variant="h6">
					¿Confirmar la adopcion de {perro.nombre}?
				</Typography>
				<Button
					color="success"
					variant="outlined"
					onClick={handleConfirmarAdopcion}
					sx={{ marginTop: 2 }}
				>
					Confirmar
				</Button>
				<Typography component="h3" variant="caption" sx={{ marginTop: 2 }}>
					Tambien podés eliminarlo asi ya no figura en el sistema
				</Typography>
				<Button
					variant="contained"
					color="error"
					sx={{ marginTop: 2 }}
					onClick={() => {
						handleConfirmarEliminar();
					}}
				>
					Eliminar del sistema
				</Button>
				<Typography component="h4" variant="caption" sx={{ marginTop: 2 }}>
					(Ninguna de estas acciones puede revertirse)
				</Typography>
			</div>
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

export default ConfirmAdoptPage;
