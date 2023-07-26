import { useLocation } from "react-router-dom"; // Para obtener el parametro pasado por la url
import {
	Card,
	List,
	Typography,
	Container,
	ListItemText,
	ListItem,
	Divider,
	Grid,
	TextField,
	Button,
	Snackbar,
	Alert,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { Close, Edit, Password, Save } from "@mui/icons-material";
import url from "../data/url";
import { NavLink } from "react-router-dom";
import { Context } from "../context/Context";

function CampaniaProfilePage() {
	// Declaracion de snackbar para mostrar mensajes.
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	// Obtiene el id de la campaña que se pasa como parametro en la url
	const location = useLocation();
	const idCampania = location.pathname.split("/")[2];

	// Variables para mostrar/ocultar opciones en funcion de si accede un veterinario.
	const { usuario } = useContext(Context);
	const [esVeterinario, setEsVeterinario] = useState(false);
	useEffect(() => {
		if (usuario != null && usuario.rol === "veterinario") {
			setEsVeterinario(true);
		}
	}, [usuario]);

	// Token de la sesion
	const token = localStorage.getItem("jwt");

	// Campaña de la que se muestran los datos
	const [campania, setCampania] = useState(obtenerCampania);

	// Asigna al perfil la campaña obtenida de la BD.
	useEffect(() => {
		obtenerCampania().then((campania) => setCampania(campania));
		setEditar(false);
	}, [idCampania]);

	// Obtiene la campania de la BD mediante su ID.
	async function obtenerCampania() {
		try {
			const response = await fetch(url + "campanias/" + idCampania, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					token: `${token}`,
				},
			});
			let campain = await response.json();
			if (campain == null) {
				setSnackbar({
					children: "No se encontro la campania",
					severity: "error",
				});
			}
			console.log(campain);
			return campain;
		} catch (error) {
			console.error("Error en el fetch: " + error);

			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
			return null;
		}
	}

	// Atributos a mostrar de las campanias
	const [nombre, setNombre] = useState("");
	const [motivo, setMotivo] = useState("");
	const [cvu, setCvu] = useState("");
	const [email, setEmail] = useState("");
	const [telefono, setTelefono] = useState("");
	const [fechaInicio, setFechaInicio] = useState("");
	const [fechaFin, setFechaFin] = useState("");

	// Se ejecuta cada vez que cambia la campaña (si es modificada por ejemplo)
	// seteando los nuevos valores
	useEffect(() => {
		setNombre(campania.nombre);
		setMotivo(campania.motivo);
		setCvu(campania.cvu);
		setEmail(campania.email);
		setTelefono(campania.telefono);
		setFechaInicio(campania.fechaInicio);
		setFechaFin(campania.fechaFin);
	}, [campania]);

	// Si no hay campania para mostrar entonces se regresa a la pagina de campanias.
	//if (campania == null) {
	//	location.replace("/campanias");
	//}

	// Variables para editar los atributos.
	const [editar, setEditar] = useState(false);
	const handleEditarClick = () => {
		setEditar(true);
	};

	// Funcion para validar que los datos de entrada no sean campos vacios.
	function validarDatos(datos) {
		if (datos.get("email").toString().trim() == "") {
			setEmail(campania.email);
			return false;
		}
		if (datos.get("motivo").trim() == "") {
			setMotivo(campania.motivo);
			return false;
		}
		if (datos.get("nombre").trim() == "") {
			setNombre(campania.nombre);
			return false;
		}
		if (datos.get("cvu").trim() == "") {
			setCvu(campania.cvu);
			return false;
		}
		if (datos.get("telefono").trim() == "") {
			setTelefono(campania.telefono);
			return false;
		}
		if (datos.get("fechaInicio").trim() == "") {
			setFechaInicio(campania.fechaInicio);
			return false;
		}
		return true;
	}

	// Manejador del submit que modifica los datos.
	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		if (!validarDatos(data)) {
			setSnackbar({
				children: "No puede ingresar un campo vacio.",
				severity: "error",
			});
			return;
		}
		const campain = {
			...campania,
			nombre: data.get("nombre"),
			motivo: data.get("motivo"),
			cvu: data.get("cvu"),
			email: data.get("email"),
			telefono: data.get("telefono"),
			fechaInicio: data.get("fechaInicio"),
			fechaFin: data.get("fechaFin"),
		};
		const response = await fetch(url + "campanias/modify/" + idCampania, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
			body: JSON.stringify(campain),
		});
		if (response.ok) {
			setCampania(campain);
			setSnackbar({
				children: "Modificación realizada con éxito",
				severity: "success",
			});
			setEditar(false);
			return;
		}
		if (response.status == 400) {
			setSnackbar({
				children: "Dato invalido",
				severity: "error",
			});
			return;
		}
		setSnackbar({
			children: "Error al conectar con la base de datos",
			severity: "error",
		});
	};

	// Manejador del boton de cancelar la edicion.
	const handleCancelarClick = () => {
		setNombre(campania.nombre);
		setMotivo(campania.motivo);
		setCvu(campania.cvu);
		setEmail(campania.email);
		setTelefono(campania.telefono);
		setFechaInicio(campania.fechaInicio);
		setFechaFin(campania.fechaFin);
		setEditar(false);
	};

	// Botones editar, guardar y cancelar.
	const EditarBoton = () => (
		<Button
			startIcon={<Edit />}
			fullWidth
			variant='contained'
			onClick={handleEditarClick}
		>
			Editar
		</Button>
	);
	const GuardarBoton = () => (
		<Button
			startIcon={<Save />}
			fullWidth
			color={"success"}
			variant='contained'
			type='submit'
		>
			Guardar
		</Button>
	);
	const CancelarBoton = () => (
		<Button
			startIcon={<Close />}
			fullWidth
			color={"error"}
			variant='contained'
			onClick={handleCancelarClick}
		>
			Cancelar
		</Button>
	);

	return (
		<Container component='main' maxWidth='sm'>
			<Card sx={{ padding: "10px", marginTop: 4 }}>
				<List component='form' onSubmit={handleSubmit}>
					<ListItem>
						<ListItemText
							primary={
								<Typography variant='h5'>Campaña {campania.nombre}</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem>
						<ListItemText>
							<Typography variant='h7' sx={{ mr: "20px" }}>
								Nombre
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								name='nombre'
								id='nombre'
								value={nombre}
								onChange={(event) => {
									setNombre(event.target.value);
								}}
								variant='outlined'
								size='small'
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant='h7' sx={{ mr: "20px" }}>
								Motivo
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								name='motivo'
								id='motivo'
								value={motivo}
								onChange={(event) => {
									setMotivo(event.target.value);
								}}
								variant='outlined'
								size='small'
								multiline
								rows={8} // Ajusta el número de filas para hacerlo más alto verticalmente
								inputProps={{ style: { width: "100%" } }} // Ajusta el ancho del campo de texto
								InputLabelProps={{
									style: {
										overflow: "hidden",
										textOverflow: "ellipsis",
										width: "100%",
									},
								}} // Ajusta el ancho de la etiqueta
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant='h7' sx={{ mr: "20px" }}>
								CVU/CBU
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								name='cvu'
								fullWidth
								id='cvu'
								value={cvu}
								onChange={(event) => {
									setCvu(event.target.value);
								}}
								variant='outlined'
								size='small'
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant='h7' sx={{ mr: "20px" }}>
								Email
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								name='email'
								id='email'
								value={email}
								onChange={(event) => {
									setEmail(event.target.value);
								}}
								variant='outlined'
								size='small'
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant='h7' sx={{ mr: "20px" }}>
								Telefono
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								type='number'
								id='telefono'
								name='telefono'
								value={telefono}
								onChange={(event) => {
									setTelefono(event.target.value);
								}}
								variant='outlined'
								size='small'
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant='h7' sx={{ mr: "20px" }}>
								Fecha inicio
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								style={{ color: "#000" }}
								type='date'
								fullWidth
								id='fechaInicio'
								name='fechaInicio'
								value={fechaInicio}
								variant='outlined'
								size='small'
								onChange={(event) => {
									setFechaInicio(event.target.value);
								}}
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant='h7' sx={{ mr: "20px" }}>
								Fecha fin
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								style={{ color: "#000" }}
								type='date'
								fullWidth
								id='fechaFin'
								name='fechaFin'
								value={fechaFin}
								variant='outlined'
								size='small'
								onChange={(event) => {
									setFechaFin(event.target.value);
								}}
							/>
						</ListItemText>
					</ListItem>

					{esVeterinario ? (
						<ListItem>
							{!editar ? (
								<EditarBoton />
							) : (
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6}>
										<GuardarBoton />
									</Grid>
									<Grid item xs={12} sm={6}>
										<CancelarBoton />
									</Grid>
								</Grid>
							)}
						</ListItem>
					) : null}
					<ListItem>
						{!esVeterinario ? (
							<NavLink style={{ width: "100%" }} to={"/donar"}>
								<Button
									fullWidth
									variant='contained'
									color={"success"}
									to={`/campanias/donar/${nombre}`}
									component={NavLink}
								>
									Donar
								</Button>
							</NavLink>
						) : null}
					</ListItem>
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

export default CampaniaProfilePage;
