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
	MenuItem,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { Close, Edit, Password, Save } from "@mui/icons-material";
import url from "../data/url";
import { NavLink } from "react-router-dom";
import { Context } from "../context/Context";

function PaseadorCuidadorProfilePage() {
	// Declaracion de snackbar para mostrar mensajes.
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	// Obtiene el id del paseador/cuidador que se pasa como parametro en la url
	const location = useLocation();
	const idPaseadorCuidador = location.pathname.split("/")[4];

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

	// paseador/cuidador de la que se muestran los datos
	const [paseadorCuidador, setPaseadorCuidador] = useState(
		obtenerPaseadorCuidador
	);

	// Asigna al perfil el paseador-cuidador obtenido de la BD.
	useEffect(() => {
		obtenerPaseadorCuidador().then((paseadorCuidador) =>
			setPaseadorCuidador(paseadorCuidador)
		);
		setEditar(false);
	}, [idPaseadorCuidador]);

	// Obtiene el paseadorCuidador de la BD mediante su ID.
	async function obtenerPaseadorCuidador() {
		try {
			const response = await fetch(url + "paseador/" + idPaseadorCuidador, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					token: `${token}`,
				},
			});
			let datos = await response.json();
			if (datos == null) {
				setSnackbar({
					children: "No se encontro el paseador/cuidador.",
					severity: "error",
				});
			}
			console.log(datos);
			return datos;
		} catch (error) {
			console.error("Error en el fetch: " + error);

			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
			return null;
		}
	}

	// Atributos a mostrar de los paseadores/cuidadores
	// nombre, apellido, dni, telefono, email, zona y estado
	const [nombre, setNombre] = useState("");
	const [apellido, setApellido] = useState("");
	const [dni, setDni] = useState("");
	const [email, setEmail] = useState("");
	const [telefono, setTelefono] = useState("");
	const [zona, setZona] = useState("");
	const [estado, setEstado] = useState("");
	const [tipo, setTipo] = useState("");

	// Se ejecuta cada vez que cambia el paseador/cuidador (si es modificado por ejemplo)
	// seteando los nuevos valores
	useEffect(() => {
		setNombre(paseadorCuidador.nombre);
		setApellido(paseadorCuidador.apellido);
		setDni(paseadorCuidador.dni);
		setEmail(paseadorCuidador.email);
		setTelefono(paseadorCuidador.telefono);
		setZona(paseadorCuidador.zona);
		setEstado(paseadorCuidador.estado);
		setTipo(paseadorCuidador.tipo);
	}, [paseadorCuidador]);

	// Variables para editar los atributos.
	const [editar, setEditar] = useState(false);
	const handleEditarClick = () => {
		setEditar(true);
	};

	// Funcion para validar que los datos de entrada no sean campos vacios.
	function validarDatos(datos) {
		if (datos.get("email").toString().trim() == "") {
			setEmail(paseadorCuidador.email);
			return false;
		}
		if (datos.get("dni").trim() == "") {
			setDni(paseadorCuidador.dni);
			return false;
		}
		if (datos.get("nombre").trim() == "") {
			setNombre(paseadorCuidador.nombre);
			return false;
		}
		if (datos.get("apellido").trim() == "") {
			setApellido(paseadorCuidador.apellido);
			return false;
		}
		if (datos.get("telefono").trim() == "") {
			setTelefono(paseadorCuidador.telefono);
			return false;
		}
		if (datos.get("zona").trim() == "") {
			setZona(paseadorCuidador.zona);
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
		const modificando = {
			...paseadorCuidador,
			nombre: data.get("nombre"),
			dni: data.get("dni"),
			zona: data.get("zona"),
			email: data.get("email"),
			telefono: data.get("telefono"),
			apellido: data.get("apellido"),
			estado: data.get("estado"),
		};
		const response = await fetch(
			url + "paseador/modify/" + idPaseadorCuidador,
			{
				method: "PUT",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					token: `${token}`,
				},
				body: JSON.stringify(modificando),
			}
		);
		if (response.ok) {
			setPaseadorCuidador(modificando);
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
		setEmail(paseadorCuidador.email);
		setDni(paseadorCuidador.dni);
		setNombre(paseadorCuidador.nombre);
		setApellido(paseadorCuidador.apellido);
		setTelefono(paseadorCuidador.telefono);
		setZona(paseadorCuidador.zona);
		setEstado(paseadorCuidador.estado);
		setEditar(false);
	};

	// Botones editar, guardar y cancelar.
	const EditarBoton = () => (
		<Button
			startIcon={<Edit />}
			fullWidth
			variant="contained"
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
			variant="contained"
			type="submit"
		>
			Guardar
		</Button>
	);
	const CancelarBoton = () => (
		<Button
			startIcon={<Close />}
			fullWidth
			color={"error"}
			variant="contained"
			onClick={handleCancelarClick}
		>
			Cancelar
		</Button>
	);

	return (
		<Container component="main" maxWidth="sm">
			<Card sx={{ padding: "10px", marginTop: 4 }}>
				<List component="form" onSubmit={handleSubmit}>
					<ListItem>
						<ListItemText
							primary={
								<Typography variant="h5">
									Perfil del {paseadorCuidador.tipo} {paseadorCuidador.nombre}
								</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem>
						<ListItemText>
							<Typography variant="h7" sx={{ mr: "20px" }}>
								Nombre
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								name="nombre"
								id="nombre"
								value={nombre}
								onChange={(event) => {
									setNombre(event.target.value);
								}}
								variant="outlined"
								size="small"
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant="h7" sx={{ mr: "20px" }}>
								Apellido
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								name="apellido"
								id="apellido"
								value={apellido}
								onChange={(event) => {
									setApellido(event.target.value);
								}}
								variant="outlined"
								size="small"
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant="h7" sx={{ mr: "20px" }}>
								DNI
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								name="dni"
								fullWidth
								id="dni"
								value={dni}
								onChange={(event) => {
									setDni(event.target.value);
								}}
								variant="outlined"
								size="small"
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant="h7" sx={{ mr: "20px" }}>
								Email
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								name="email"
								id="email"
								value={email}
								onChange={(event) => {
									setEmail(event.target.value);
								}}
								variant="outlined"
								size="small"
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant="h7" sx={{ mr: "20px" }}>
								Telefono
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								type="number"
								id="telefono"
								name="telefono"
								value={telefono}
								onChange={(event) => {
									setTelefono(event.target.value);
								}}
								variant="outlined"
								size="small"
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant="h7" sx={{ mr: "20px" }}>
								Zona
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								id="zona"
								name="zona"
								value={zona}
								onChange={(event) => {
									setZona(event.target.value);
								}}
								variant="outlined"
								size="small"
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant="h7" sx={{ mr: "20px" }}>
								Estado
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								id="estado"
								name="estado"
								select
								required
								fullWidth
								value={estado}
								onChange={(event) => {
									setEstado(event.target.value);
								}}
							>
								<MenuItem key={"disponible"} value={true}>
									Disponible
								</MenuItem>
								<MenuItem key={"no disponible"} value={false}>
									No disponible
								</MenuItem>
							</TextField>
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

export default PaseadorCuidadorProfilePage;
