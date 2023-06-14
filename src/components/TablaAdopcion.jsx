import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Snackbar,
	Tooltip,
	Typography,
} from "@mui/material";
import {
	DataGrid,
	GridActionsCellItem,
	GridOverlay,
	GridRowModes,
} from "@mui/x-data-grid";
import { useCallback, useContext, useEffect, useState } from "react";
import url from "../data/url";
import { Context } from "../context/Context";
import {
	Cancel,
	CheckCircle,
	DeleteForever,
	Done,
	Edit,
	Email,
	Save,
	Send,
} from "@mui/icons-material";
import emailjs from "emailjs-com";
import { razas } from "../data/perros";

function TablaAdopcion() {
	const token = localStorage.getItem("jwt");
	const { usuario } = useContext(Context);

	const [rows, setRows] = useState([]);

	const [perroSolicitado, setPerroSolicitado] = useState({});
	const [perroAdoptado, setPerroAdoptado] = useState({});
	const [perroEliminar, setPerroEliminar] = useState({});

	useEffect(() => {
		actualizarTabla();
	}, []);

	function actualizarTabla() {
		obtenerPerros().then((rows) => setRows(rows));
	}

	async function obtenerPerros() {
		try {
			const response = await fetch(url + "adopciones/", {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					token: `${token}`,
				},
			});
			if (!response.ok) {
				setSnackbar({
					children:
						"Ocurrió un error al intentar cargar la lista de perros en adopción",
					severity: "error",
				});
				return [];
			}
			let perros = await response.json();
			if (perros.length == 0) {
				setSnackbar({
					children: "La lista de perros en adopción se encuentra vacía",
					severity: "info",
				});
			}
			return (
				perros
					//orden por id del perro
					.sort((a, b) => a.id - b.id)
					//orden primero los del usuario actual
					.sort((a) => {
						if (usuario) {
							if (a.idUsuario == usuario.id) {
								return 1;
							}
							return -1;
						}
					})
					//orden ultimos los adoptados
					.sort((a) => {
						if (a.estado == "Adoptado") {
							return 1;
						}
						if (a.estado == "Pendiente") {
							return -1;
						}
					})
			);
		} catch (error) {
			console.error("Error en el fetch: " + error);

			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
			return [];
		}
	}

	const columns = [
		// Datos de los perros: ID, nombre, raza, edad, enfermedad, sexo y caracteristicas
		{ field: "id", id: "id" },
		{ field: "idUsuario", id: "idUsuario" },
		{ field: "nombre", headerName: "Nombre", width: 100, editable: true },
		{
			field: "edad",
			headerName: "Edad",
			type: "number",
			width: 100,
			editable: true,
		},
		{
			field: "raza",
			headerName: "Raza",
			width: 200,
			type: "singleSelect",
			valueOptions: razas,
			editable: true,
		},
		{
			field: "sexo",
			headerName: "Sexo",
			width: 100,
			type: "singleSelect",
			valueOptions: ["Masculino", "Femenino"],
			editable: true,
		},
		{
			field: "caracteristicas",
			headerName: "Caracteristicas",
			width: 160,
			editable: true,
		},
		{
			field: "enfermedades",
			headerName: "Enfermedades",
			width: 150,
			editable: true,
		},
		{
			field: "telefono",
			headerName: "Teléfono",
			width: 100,
			type: "number", //no deberia poner "."
			editable: true,
		},
		{
			field: "email",
			headerName: "Email",
			width: 200,
			editable: true,
		},
		{
			//si esta adoptado o no
			field: "estado",
			headerName: "Estado",
			width: 100,
		},
	];

	columns.push({
		field: "actions",
		headerName: "",
		minWidth: 100,
		flex: 1,
		align: "right",
		renderCell: (params) => {
			const data = params.row;
			if (
				(!usuario ||
					(data.idUsuario != usuario.id && usuario.rol != "veterinario")) &&
				data.estado != "Adoptado"
			) {
				return (
					<Tooltip title='Solicitar adopción'>
						<GridActionsCellItem
							icon={<Email />}
							key='solicitar'
							label='Solicitar'
							onClick={() => {
								let perroSolicitado = { ...data };
								// perroSolicitado.estado = 'Solicitado';
								handleClickOpenConfirmarSolicitar();
								setPerroSolicitado(perroSolicitado);
							}}
							sx={{
								"&:hover": {
									color: "primary.main",
								},
							}}
						/>
					</Tooltip>
				);
			}

			const isInEditMode = rowModesModel[data.id]?.mode === GridRowModes.Edit;

			if (isInEditMode) {
				return [
					<Tooltip title='Guardar' key='save'>
						<GridActionsCellItem
							icon={<Save />}
							label='Save'
							onClick={handleSaveClick(data.id)}
							sx={{
								"&:hover": {
									color: "primary.main",
								},
							}}
						/>
					</Tooltip>,
					<Tooltip title='Cancelar' key='cancel'>
						<GridActionsCellItem
							icon={<Cancel />}
							label='Cancel'
							className='textPrimary'
							onClick={handleCancelClick(data.id)}
							sx={{
								"&:hover": {
									color: "red",
								},
							}}
						/>
					</Tooltip>,
				];
			}
			if (
				usuario &&
				(usuario.rol == "veterinario" || data.idUsuario == usuario.id) &&
				data.estado != "Adoptado"
			) {
				return (
					<>
						<Tooltip title='Confirmar adopción'>
							<GridActionsCellItem
								icon={<CheckCircle />}
								key='adoptado'
								label='Adoptado'
								onClick={() => {
									let perroAdoptado = { ...data };
									// perroAdoptado.estado = 'Adoptado';
									handleClickOpenConfirmarAdopcion();
									setPerroAdoptado(perroAdoptado);
								}}
								sx={{
									"&:hover": {
										color: "green",
									},
								}}
							/>
						</Tooltip>
						<Tooltip key='edit' title='Editar'>
							<GridActionsCellItem
								icon={<Edit />}
								label='Edit'
								className='textPrimary'
								onClick={handleEditClick(data.id)}
								sx={{
									"&:hover": {
										color: "primary.main",
									},
								}}
							/>
						</Tooltip>
						<Tooltip title='Eliminar perro'>
							<GridActionsCellItem
								icon={<DeleteForever />}
								key='eliminar'
								label='Eliminar'
								onClick={() => {
									let perroEliminar = { ...data };
									handleClickOpenConfirmarEliminar();
									setPerroEliminar(perroEliminar);
								}}
								sx={{
									"&:hover": {
										color: "red",
									},
								}}
							/>
						</Tooltip>
					</>
				);
			}
		},
	});

	//configuracion para editar la tabla
	const [rowModesModel, setRowModesModel] = useState({});

	const handleRowEditStart = (params, event) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop = (params, event) => {
		event.defaultMuiPrevented = true;
	};

	const handleEditClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleCancelClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		const editedRow = rows.find((row) => row.id === id);
		if (editedRow.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};

	const handleRowModesModelChange = (newRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const [openConfirmarSolicitar, setOpenConfirmarSolicitar] = useState(false);
	const [openConfirmarAdopcion, setOpenConfirmarAdopcion] = useState(false);
	const [openConfirmarEliminar, setOpenConfirmarEliminar] = useState(false);

	const handleClickOpenConfirmarSolicitar = () => {
		setOpenConfirmarSolicitar(true);
	};
	const handleClickOpenConfirmarAdopcion = () => {
		setOpenConfirmarAdopcion(true);
	};
	const handleClickOpenConfirmarEliminar = () => {
		setOpenConfirmarEliminar(true);
	};
	const handleCloseConfirmarSolicitar = () => {
		setOpenConfirmarSolicitar(false);
	};
	const handleCloseConfirmarAdopcion = () => {
		setOpenConfirmarAdopcion(false);
	};
	const handleCloseConfirmarEliminar = () => {
		setOpenConfirmarEliminar(false);
	};

	// DESCOMENTAR ACA ABAJO EL SEND MAIL-------------

	const handleConfirmarSolicitar = () => {
		// Aca se envia el email o se va a la pagina de solicitar datos:
		// Si el usuario no esta logueado entonces lo redirecciona a una pagina para pedirle sus datos
		// Si el usuario esta logueado envia el email desde esta misma pagina con los datos que saca del localStorage
		if (!usuario) {
			// Si no es un usuario logueado
			location.replace(`pedir-datos-para-adoptar/${perroSolicitado.id}`);
		} else {
			// Si es un usuario logueado (solo en ese caso debe ejecutarse sendEmail)

			sendEmail(); // DESCOMENTAR
			setSnackbar({
				children: "Solicitud enviada con exito.",
				severity: "success",
			});
			setTimeout(() => {
				window.location.replace("/adopcion");
			}, 1000);
		}
	};

	function sendEmail() {
		// "Crea" un formulario ya que la API necesita que los datos se envien en uno
		const e = {
			preventDefault: () => {},
			target: document.createElement("form"),
		};

		// Agrega campos al formulario recien creado
		// En el template de la API se utiliza el "name" de los campos para referenciar los valores
		// dentro del cuerpo del email. En value van los valores que se quiere enviar a la API.
		// Se van a enviar nombrePersona, apellidoPersona y telefonoPersona de la persona que aprete adoptar
		// Y tambien nombrePerro y mail del perro a adoptar. (el mail es al que le llega el email)

		// Datos de quien presiona adoptar:
		const nombrePersonaInput = document.createElement("input");
		nombrePersonaInput.name = "nombrePersona";
		nombrePersonaInput.value = usuario.nombre;
		e.target.appendChild(nombrePersonaInput);

		const apellidoPersonaInput = document.createElement("input");
		apellidoPersonaInput.name = "apellidoPersona";
		apellidoPersonaInput.value = usuario.apellido;
		e.target.appendChild(apellidoPersonaInput);

		const telefonoPersonaInput = document.createElement("input");
		telefonoPersonaInput.name = "telefonoPersona";
		telefonoPersonaInput.value = usuario.telefono;
		e.target.appendChild(telefonoPersonaInput);

		// Datos del perro que esta siendo adoptado:
		const nombrePerroInput = document.createElement("input");
		nombrePerroInput.name = "nombrePerro";
		nombrePerroInput.value = perroSolicitado.nombre;
		e.target.appendChild(nombrePerroInput);

		// Email al que llega el correo
		const direccionEmail = document.createElement("input");
		direccionEmail.name = "email";
		direccionEmail.value = perroSolicitado.email;
		e.target.appendChild(direccionEmail);

		// URL para confirmar la adopcion
		const urlConfirmar = document.createElement("input");
		urlConfirmar.name = "urlConfirmar";
		urlConfirmar.value =
			"http://localhost:5173/confirmar-adopcion/" + perroSolicitado.id;
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

	const handleConfirmarAdopcion = async (perro) => {
		const response = await fetch(url + "adopciones/adoptar/" + perro.id, {
			method: "put",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
		});
		if (response.ok) {
			setTimeout(
				() =>
					setSnackbar({
						children: "Perro marcado como adoptado con exito",
						severity: "success",
					}),
				1000
			);
			actualizarTabla();
		}
		if (response.status == 500) {
			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
		}
	};

	const handleConfirmarEliminar = async (perro) => {
		console.log(perro);
		const response = await fetch(url + "adopciones/delete/" + perro.id, {
			method: "delete",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
		});
		if (response.ok) {
			setTimeout(() => {
				setSnackbar({
					children: "Perro eliminado con exito",
					severity: "success",
				});
			}, 1000);
			actualizarTabla();
		}
		if (response.status == 500) {
			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
		}
	};

	const [snackbar, setSnackbar] = useState(null);

	const handleCloseSnackbar = () => setSnackbar(null);

	// Funcion para validar los datos al modificarlos
	function validarDatos(datos) {
		console.log(datos);
		return (
			datos.nombre.trim() !== "" &&
			datos.edad.toString().trim() !== "" &&
			datos.raza.trim() !== "" &&
			// datos.caracteristicas.trim() !== '' &&
			// datos.enfermedad.trim() !== '' &&
			datos.sexo.trim() !== "" &&
			datos.telefono.toString().trim() !== "" &&
			datos.email.trim() !== ""
		);
	}

	// Fetch de modificacion de los datos de un perro
	const processRowUpdate = useCallback(async (newRow, oldRow) => {
		if (!validarDatos(newRow)) {
			setSnackbar({
				children: "No puede ingresar un campo vacio.",
				severity: "error",
			});
			return oldRow;
		}
		const response = await fetch(url + "adopciones/modify/" + newRow.id, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
			body: JSON.stringify(newRow),
		});
		if (response.ok) {
			setSnackbar({
				children: "Perro modificado con exito",
				severity: "success",
			});
			return newRow;
		}
		if (response.status == 500) {
			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
		}
		return oldRow;
	}, []);

	const handleProcessRowUpdateError = useCallback((error) => {
		setSnackbar({ children: error.message, severity: "error" });
	}, []);

	const CustomNoRowsOverlay = () => {
		return (
			<GridOverlay>
				<div>No hay perros en adopción cargados</div>
			</GridOverlay>
		);
	};
	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columns}
				editMode='row'
				// isCellEditable={(params) => {
				// 	return (
				// 		usuario &&
				// 		(params.row.idUsuario == usuario.id || usuario.rol == 'veterinario')
				// 	);
				// }}
				columnVisibilityModel={{
					id: false,
					idUsuario: false,
					//deberia poder verse el email y el telefono?
					// email: false,
					// telefono: false,
				}}
				rowModesModel={rowModesModel}
				onRowModesModelChange={handleRowModesModelChange}
				onRowEditStart={handleRowEditStart}
				onRowEditStop={handleRowEditStop}
				processRowUpdate={processRowUpdate}
				onProcessRowUpdateError={handleProcessRowUpdateError}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 5 },
					},
				}}
				pageSizeOptions={[5, 10]}
				components={{
					NoRowsOverlay: CustomNoRowsOverlay,
				}}
			/>
			<Dialog
				open={openConfirmarAdopcion}
				onClose={handleCloseConfirmarAdopcion}
				aria-labelledby='confirmar-title'
				aria-describedby='confirmar-description'
			>
				<DialogTitle id='confirmar-title'>
					Estas seguro/a de <b style={{ color: "green" }}>confirmar</b> que el
					perro fue adoptado?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='confirmar-description'>
						Una vez que confirmes, se actualizará su estado y no se podrá
						revertir
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color='success'
						variant='outlined'
						onClick={handleCloseConfirmarAdopcion}
					>
						Cancelar
					</Button>
					<Button
						variant='contained'
						color='success'
						startIcon={<Done />}
						onClick={() => {
							handleConfirmarAdopcion(perroAdoptado);
							handleCloseConfirmarAdopcion();
						}}
						autoFocus
					>
						Confirmar
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={openConfirmarSolicitar}
				onClose={handleCloseConfirmarSolicitar}
				aria-labelledby='confirmar-title'
				aria-describedby='confirmar-description'
			>
				<DialogTitle id='confirmar-title'>
					Estas seguro/a de{" "}
					<Typography
						component={"span"}
						sx={{
							fontWeight: "bold",
							fontSize: "inherit",
							color: "primary.main",
						}}
					>
						solicitar
					</Typography>{" "}
					la adopción del perro?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='confirmar-description'>
						Una vez que confirmes, se le enviará un mail al dueño del perro con
						tu solicitud y tus datos, para que puedan contactarse.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color='primary'
						variant='outlined'
						onClick={handleCloseConfirmarSolicitar}
					>
						Cancelar
					</Button>
					<Button
						variant='contained'
						color='primary'
						startIcon={<Send />}
						onClick={() => {
							handleConfirmarSolicitar(perroSolicitado);
							handleCloseConfirmarSolicitar();
						}}
						autoFocus
					>
						Solicitar
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={openConfirmarEliminar}
				onClose={handleCloseConfirmarEliminar}
				aria-labelledby='confirmar-title'
				aria-describedby='confirmar-description'
			>
				<DialogTitle id='confirmar-title'>
					Estas seguro/a de{" "}
					<Typography
						component={"span"}
						sx={{
							fontWeight: "bold",
							fontSize: "inherit",
							color: "red",
						}}
					>
						eliminar
					</Typography>{" "}
					el perro?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='confirmar-description'>
						Una vez que confirmes, no podrás deshacer esta acción
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color='error'
						variant='outlined'
						onClick={handleCloseConfirmarEliminar}
					>
						Cancelar
					</Button>
					<Button
						variant='contained'
						color='error'
						startIcon={<DeleteForever />}
						onClick={() => {
							handleConfirmarEliminar(perroEliminar);
							handleCloseConfirmarEliminar();
						}}
						autoFocus
					>
						Eliminar
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
		</div>
	);
}

export default TablaAdopcion;
