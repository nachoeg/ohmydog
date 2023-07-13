import { Context } from "../context/Context";
import { useEffect, useState, useCallback, useContext } from "react";
import url from "../data/url";
import {
	DataGrid,
	GridActionsCellItem,
	GridOverlay,
	GridRowModes,
} from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Delete from "@mui/icons-material/DeleteForever";
import { razas } from "../data/perros";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { Tooltip } from "@mui/material";

// La tabla de paseadores/cuidadores recibe en props si debe mostrar los borrados
function TablaPaseadoresCuidadores(props) {
	const { usuario } = useContext(Context); // Usuario que accede a la tabla
	const token = localStorage.getItem("jwt");

	const [esVeterinario, setEsVeterinario] = useState(false); // Para ocultar o mostrar funciones de veterinarios

	//Habilita/muestra opciones en funcion de si entra un veterinario.
	useEffect(() => {
		if (usuario != null && usuario.rol === "veterinario") {
			setEsVeterinario(true);
		}
	}, [usuario]);

	// Declara una snackbar para mostrar mensajes
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null); // Manejador del cierre de la snackbar

	// Columnas a mostrar
	const [rows, setRows] = useState([]);

	// Establece las columnas a mostrar de la tabla de cuidadores y paseadores
	const columns = [
		// Datos de las campañas: Nombre, apellido, DNI, telefono, mail, zona y un tipo para distinguir si es paseador o cuidador.
		{ field: "id", headerName: "ID", width: 50, id: "id" },
		{
			field: "tipo",
			headerName: "Tipo",
			width: 90,
			id: "tipo",
		},
		{
			field: "nombre",
			headerName: "Nombre",
			width: 150,
			id: "nombre",
		},
		{
			field: "apellido",
			headerName: "Apellido",
			width: 100,
			id: "apellido",
		},
		{
			field: "dni",
			headerName: "DNi",
			width: 150,
			id: "dni",
		},
		{
			field: "telefono",
			headerName: "Telefono",
			width: 100,
			id: "telefono",
		},
		{
			field: "email",
			headerName: "Mail",
			width: 150,
			id: "email",
		},
		{
			field: "zona",
			headerName: "Zona",
			width: 100,
			id: "zona",
		},
		{
			field: "estado",
			headerName: "Estado",
			width: 100,
			id: "estado",
			valueFormatter: (params) =>
				params.value ? "Disponible" : "No disponible",
		},
	];

	// Establece las acciones de cada fila y si es veterinario muestra el borrado
	columns.push({
		field: "actions",
		headerName: "",
		minWidth: 210,
		align: "right",
		flex: 1,
		renderCell: (params) => {
			const actions = [
				<Button
					key="paseadorCuidadorPerfil"
					to={`/servicios/paseadores-cuidadores/perfil/${params.id}`}
					component={NavLink}
					sx={{ fontSize: 11, mr: 1 }}
				>
					Ver detalles
				</Button>,
			];
			if (esVeterinario && !props.borrados) {
				// Si esta en los borrados no debe mostrar el boton de borrado.
				actions.push(
					<Tooltip key="delete" title="Eliminar">
						<GridActionsCellItem
							icon={<Delete />}
							label="Delete"
							onClick={() => {
								setPaseadorCuidadorBorrar(params.row.id);
								handleClickOpenConfirmar();
							}}
							sx={{ "&:hover": { color: "red" } }}
						/>
					</Tooltip>
				);
			} else if (esVeterinario && props.borrados) {
				actions.push(
					<Button
						color={"success"}
						key="recuperar"
						onClick={() => {
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
	});

	// Si se recibe en los parametros el parametro borrado, debe hacer un fetch pero mostrando los paseadores/cuidadores borrados.
	if (!props.borrados) {
		// Asigna a las filas las campanias actuales obtenidas de la bd
		useEffect(() => {
			obtenerPaseadoresCuidadores().then((rows) => setRows(rows));
		}, []);
	} else {
		// Debe mostrar los paseadores cuidadores borrados
		useEffect(() => {
			obtenerPaseadoresCuidadoresBorrados().then((rows) => setRows(rows));
		}, []);
	}

	// Manejador del boton de recuperar
	async function handleRecuperar(id) {
		const response = await fetch(url + "paseador/recover/" + id, {
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
				window.location.replace("/servicios/paseadores-cuidadores/");
			}, 1000);
			return;
		}
		setSnackbar({
			children: "Error al conectar con la base de datos",
			severity: "error",
		});
	}

	// Obtiene los paseadores cuidadores de la BD
	async function obtenerPaseadoresCuidadoresBorrados() {
		try {
			const response = await fetch(url + "paseador/borrados", {
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
						children: "Error al mostrar las paseadores/cuidadores",
						severity: "error",
					});
				}
				return [];
			}
			let datos = await response.json();
			if (datos.length == 0) {
				setSnackbar({
					children:
						"La lista de paseadores/cuidadores borrados o no disponibles se encuentra vacia",
					severity: "info",
				});
			}
			return datos;
		} catch (error) {
			console.error("Error en el fetch: " + error);

			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
			return [];
		}
	}

	// Obtiene los paseadores cuidadores de la BD
	async function obtenerPaseadoresCuidadores() {
		try {
			const response = await fetch(url + "paseador/", {
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
						children: "Error al mostrar los paseadores/cuidadores",
						severity: "error",
					});
				}
				return [];
			}
			let paseadoresCuidadores = await response.json();
			if (paseadoresCuidadores.length == 0) {
				setSnackbar({
					children: "La lista de paseadores/cuidadores se encuentra vacia",
					severity: "info",
				});
			}
			return paseadoresCuidadores;
		} catch (error) {
			console.error("Error en el fetch: " + error);

			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
			return [];
		}
	}

	// Manejador del borrado de los paseadores/cuidadores, como el borrado es logico simplemente hace una modificacion
	// del cuidador o paseador modificando su booleano "borrado" poniendolo en true.
	async function eliminarPaseadorCuidador(id) {
		const response = await fetch(url + "paseador/delete/" + id, {
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
				children: "Paseador/cuidador eliminado con exito",
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

	// Para cambiar el mensaje que muestra si no hay paseadores/cuidadores borrados
	const CustomNoRowsOverlay = () => {
		return (
			<GridOverlay>
				<div>No hay paseadores/cuidadores borrados y/o no disponibles</div>
			</GridOverlay>
		);
	};

	// Variables para mostrar los mensajes de confirmar eliminacion
	const [openConfirmar, setOpenConfirmar] = useState(false);
	const [paseadorCuidadorBorrar, setPaseadorCuidadorBorrar] = useState();

	// Manejadores de los mensajes de confirmar
	const handleClickOpenConfirmar = () => {
		setOpenConfirmar(true);
	};
	const handleCloseConfirmar = () => {
		setOpenConfirmar(false);
	};

	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columns}
				columnVisibilityModel={{
					id: false,
				}}
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
				aria-labelledby="confirmar-title"
				aria-describedby="confirmar-description"
			>
				<DialogTitle id="confirmar-title">
					¿Estás seguro/a de <b style={{ color: "red" }}>eliminar</b>?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="confirmar-description">
						Una vez que confirmes, se moverá al listado de paseadores/cuidadores
						borrados. Podrás recuperarlo desde allí.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color="error"
						variant="outlined"
						onClick={handleCloseConfirmar}
					>
						Cancelar
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={() => {
							eliminarPaseadorCuidador(paseadorCuidadorBorrar);
							handleCloseConfirmar();
						}}
						autoFocus
					>
						Confirmar
					</Button>
				</DialogActions>
			</Dialog>
			{!!snackbar && (
				// Declaracion de propiedades de la snackbar
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

export default TablaPaseadoresCuidadores;
