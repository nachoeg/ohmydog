import { useEffect, useState, useCallback } from "react";
import url from "../data/url";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Delete from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { GridOverlay } from "@mui/x-data-grid";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Tooltip,
} from "@mui/material";
import { CalendarMonth, Edit, Pets } from "@mui/icons-material";

function TablaUsuarios(props) {
	const token = localStorage.getItem("jwt");
	const [rows, setRows] = useState([]);

	if (props.borrados) {
		useEffect(() => {
			obtenerUsuariosBorrados().then((rows) => setRows(rows));
		}, []);
	} else {
		useEffect(() => {
			obtenerUsuarios().then((rows) => setRows(rows));
		}, []);
	}

	async function obtenerUsuariosBorrados() {
		try {
			const response = await fetch(url + "usuarios/usuariosBorrados", {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					token: `${token}`,
				},
			});
			if (!response.ok) {
				if (response.status == 401) {
					setSnackbar({
						children: "No estas autorizado para ver los usuarios",
						severity: "error",
					});
				}
				return [];
			}
			let usuarios = await response.json();
			if (usuarios.length == 0) {
				setSnackbar({
					children: "La lista de usuarios clientes se encuentra vacia",
					severity: "info",
				});
			}
			return usuarios;
		} catch (error) {
			console.error("Error en el fetch: " + error);

			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
			return [];
		}
	}

	// Manejador del boton de recuperar
	async function handleRecuperar(id) {
		const response = await fetch(url + "usuarios/recover/" + id, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
		});
		if (response.ok) {
			setSnackbar({
				children: "Recuperacion realizada con éxito",
				severity: "success",
			});
			setTimeout(() => {
				window.location.replace("/usuarios/");
			}, 1000);
			return;
		}
		setSnackbar({
			children: "Error al conectar con la base de datos",
			severity: "error",
		});
	}

	async function obtenerUsuarios() {
		try {
			const response = await fetch(url + "usuarios", {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					token: `${token}`,
				},
			});
			if (!response.ok) {
				if (response.status == 401) {
					setSnackbar({
						children: "No estas autorizado para ver los usuarios",
						severity: "error",
					});
				}
				return [];
			}
			let usuarios = await response.json();
			if (usuarios.length == 0) {
				setSnackbar({
					children: "La lista de usuarios clientes se encuentra vacia",
					severity: "info",
				});
			}
			return usuarios;
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
		{ field: "id", headerName: "ID", width: 0, id: "id" },
		{
			field: "email",
			headerName: "Email",
			width: 200,
		},
		{ field: "nombre", headerName: "Nombre", width: 100 },
		{ field: "apellido", headerName: "Apellido", width: 100 },
		{
			field: "dni",
			headerName: "DNI",
			type: "number",
			width: 100,
		},
		{
			field: "telefono",
			headerName: "Telefono",
			width: 100,
		},
		{
			field: "direccion",
			headerName: "Direccion",
			width: 100,
		},
		{
			field: "localidad",
			headerName: "Localidad",
			width: 100,
		},
		{
			field: "actions",
			headerName: "",
			minWidth: 300,
			flex: 1,
			align: "right",
			renderCell: (params) => {
				let { id, nombre, apellido } = params.row;
				apellido = apellido.replaceAll(" ", "-");
				nombre = nombre.replaceAll(" ", "-");

				const actions = [
					<Button
						key='perros'
						startIcon={<Pets />}
						to={`/perros/usuario/${id}/${nombre}-${apellido}`}
						component={NavLink}
						sx={{ fontSize: 11, mr: 1 }}
					>
						Perros
					</Button>,
					<Button
						key='turnos'
						startIcon={<CalendarMonth />}
						to={`/turnos/cliente/${id}/${nombre}-${apellido}`}
						component={NavLink}
						sx={{ fontSize: 11, mr: 1 }}
					>
						Turnos
					</Button>,
					<Tooltip key='modificar' title='Modificar'>
						<GridActionsCellItem
							component={NavLink}
							icon={<Edit />}
							to={`/perfil/${id}`}
							sx={{
								"&:hover": {
									color: "primary.main",
								},
							}}
						></GridActionsCellItem>
					</Tooltip>,
				];

				if (!props.borrados) {
					actions.push(
						<Tooltip key='delete' title='Eliminar'>
							<GridActionsCellItem
								icon={<Delete />}
								label='Delete'
								onClick={() => {
									setUsuarioBorrar(id);
									handleClickOpenConfirmar();
								}}
								sx={{
									"&:hover": {
										color: "red",
									},
								}}
							/>
						</Tooltip>
					);
				} else {
					actions.push(
						<Button
							color={"success"}
							key='recuperar'
							onClick={() => {
								console.log("Quiso recuperar " + params.row.id);
								handleRecuperar(params.row.id);
							}}
							sx={{ fontSize: 11, mr: 1 }}
						>
							Recuperar
						</Button>
					);
				}
				return <>{actions}</>;
			},
		},
	];

	const [openConfirmar, setOpenConfirmar] = useState(false);

	const [usuarioBorrar, setUsuarioBorrar] = useState();

	const handleClickOpenConfirmar = () => {
		setOpenConfirmar(true);
	};

	const handleCloseConfirmar = () => {
		setOpenConfirmar(false);
	};

	const [snackbar, setSnackbar] = useState(null);

	const handleCloseSnackbar = () => setSnackbar(null);

	async function eliminarUsuario(id) {
		const response = await fetch(url + "usuarios/delete/" + id, {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				token: `${token}`,
			},
		});
		console.log(response);
		if (response.ok) {
			setSnackbar({
				children: "Usuario eliminado con exito",
				severity: "success",
			});
			setRows(rows.filter((row) => row.id !== id));
		} else {
			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
		}
	}

	// Funcionalidad deprecada, ya no se modifica un usuario directamente desde la tabla.
	// Se hace desde un boton.

	// function validarDatos(datos) {
	// 	return (
	// 		datos.email.trim() != "" &&
	// 		toString(datos.telefono).trim() != "" &&
	// 		datos.localidad.trim() != "" &&
	// 		datos.direccion.trim() != ""
	// 	);
	// }

	// const processRowUpdate = useCallback(async (newRow, oldRow) => {
	// 	if (!validarDatos(newRow)) {
	// 		setSnackbar({
	// 			children: "No puede ingresar un campo vacio",
	// 			severity: "error",
	// 		});
	// 		return oldRow;
	// 	}
	// 	const response = await fetch(url + "usuarios/modify/" + newRow.id, {
	// 		method: "PUT",
	// 		credentials: "include",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			token: `${token}`,
	// 		},
	// 		body: JSON.stringify(newRow),
	// 	});
	// 	if (response.ok) {
	// 		setSnackbar({
	// 			children: "Usuario guardado con exito",
	// 			severity: "success",
	// 		});
	// 		return newRow;
	// 	}
	// 	if (response.status == 403) {
	// 		setSnackbar({
	// 			children: "El email ingresado ya está en uso",
	// 			severity: "error",
	// 		});
	// 	}
	// 	if (response.status == 500) {
	// 		setSnackbar({
	// 			children: "Error al conectar con la base de datos",
	// 			severity: "error",
	// 		});
	// 	}
	// 	return oldRow;
	// }, []);

	// const handleProcessRowUpdateError = useCallback((error) => {
	// 	setSnackbar({ children: error.message, severity: "error" });
	// }, []);

	const CustomNoRowsOverlay = () => {
		return (
			<GridOverlay>
				<div>No hay usuarios cargados</div>
			</GridOverlay>
		);
	};

	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				editMode='row'
				rows={rows}
				columns={columns}
				// processRowUpdate={processRowUpdate}
				// onProcessRowUpdateError={handleProcessRowUpdateError}
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
				open={openConfirmar}
				onClose={handleCloseConfirmar}
				aria-labelledby='confirmar-title'
				aria-describedby='confirmar-description'
			>
				<DialogTitle id='confirmar-title'>
					Estas seguro/a de <b style={{ color: "red" }}>eliminar</b> al usuario?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='confirmar-description'>
						Una vez que confirmes, también se eliminarán todos los perros, y
						turnos asociados al usuario.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color='error'
						variant='outlined'
						onClick={handleCloseConfirmar}
					>
						Cancelar
					</Button>
					<Button
						variant='contained'
						color='error'
						onClick={() => {
							eliminarUsuario(usuarioBorrar);
							handleCloseConfirmar();
						}}
						autoFocus
					>
						Confirmar
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

export default TablaUsuarios;
