import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import EventIcon from "@mui/icons-material/Event";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, MenuItem } from "@mui/material";
import url from "../data/url";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { GridAddIcon } from "@mui/x-data-grid";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Tooltip,
} from "@mui/material";

function MarcarPerroParaCruzar() {
	const { usuario } = useContext(Context);
	const token = localStorage.getItem("jwt");

	const [esVeterinario, setEsVeterinario] = useState(false); // Para ocultar o mostrar funciones de veterinarios

	//Habilita/muestra opciones en funcion de si entra un veterinario.
	useEffect(() => {
		if (usuario != null && usuario.rol === "veterinario") {
			setEsVeterinario(true);
		}
	}, [usuario]);

	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	const [perros, setPerros] = useState([]);

	useEffect(() => {
		obtenerPerros().then((p) => {
			setPerros(p);
			if (p != null) {
				const perrosFiltrados = p.filter(
					(perro) => !perro.castrado && !perro.disponibleCruza
				);
				if (perrosFiltrados.length === 0) {
					setOpenConfirmar(true);
				}
			}
		});
	}, []);

	function obtenerPerros() {
		return fetch(url + "perros/" + usuario.id, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
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
							children: "No estas autorizado para ver los perros",
							severity: "error",
						});
					}
					return [];
				}
			})
			.catch((error) => {
				console.error("Error en el fetch: " + error);

				setSnackbar({
					children: "Error al conectar con la base de datos",
					severity: "error",
				});
				return [];
			});
	}

	function handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const token = localStorage.getItem("jwt");
		console.log(data.get("perros"));
		const response = fetch(url + "perros/cruzar/" + data.get("perros"), {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
		}).then((response) => {
			console.log(response);
			if (response.ok) {
				setSnackbar({
					children: "Se agrego el perro.",
					severity: "success",
				});
				setTimeout(() => {
					location.replace("/cruza");
				}, 1000);
			} else {
				setSnackbar({
					children: "Error al conectar con la base de datos.",
					severity: "error",
				});
				return [];
			}
		});
	}

	const [openConfirmar, setOpenConfirmar] = useState(false);

	const handleClickOpenConfirmar = () => {
		setOpenConfirmar(true);
	};

	const handleCloseConfirmar = () => {
		window.location.replace("/cruza");
		setOpenConfirmar(false);
	};

	return (
		<Container component='main' maxWidth='ml'>
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
					<GridAddIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Agregar perro como disponible para cruzar
				</Typography>
				<Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<TextField
								required
								fullWidth
								select
								id='perros'
								name='perros'
								label='Perro'
								defaultValue={""}
							>
								{perros
									.filter((perro) => !perro.castrado && !perro.disponibleCruza)
									.map((perro) => (
										<MenuItem value={perro.id} key={perro.id}>
											{perro.nombre}
										</MenuItem>
									))}
							</TextField>
						</Grid>
					</Grid>

					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
					>
						Agregar perro
					</Button>
					<Dialog
						open={openConfirmar}
						onClose={handleCloseConfirmar}
						aria-labelledby='confirmar-title'
						aria-describedby='confirmar-description'
					>
						<DialogTitle id='confirmar-title'>
							No tenes perros cargados que puedan ser marcados como disponibles
							para cruzas.
						</DialogTitle>
						<DialogActions>
							<Button
								variant='contained'
								color='success'
								onClick={() => {
									handleCloseConfirmar();
								}}
								autoFocus
							>
								Cerrar
							</Button>
						</DialogActions>
					</Dialog>

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

export default MarcarPerroParaCruzar;
