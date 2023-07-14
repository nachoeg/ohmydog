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
import { CreditCard, Money } from "@mui/icons-material";

// La tabla de campanias recibe en props si debe mostrar las campañas borradas/pasadas
function TablaCampanias(props) {
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

	// Establece las columnas a mostrar de la tabla de campañas
	const columns = [
		// Datos de las campañas: Nombre, motivo, fecha de inicio, de fin, telefono, mail, CVU para realizar las donaciones.
		{ field: "id", headerName: "ID", width: 50, id: "id" },
		{
			field: "nombre",
			headerName: "Nombre",
			width: 150,
			id: "nombre",
		},
		{
			field: "motivo",
			headerName: "Motivo",
			width: 200,
			id: "motivo",
		},
		{
			field: "cvu",
			headerName: "CVU",
			width: 150,
			id: "cvu",
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
			width: 100,
			id: "email",
		},
		{
			field: "fechaInicio",
			headerName: "Inicio",
			width: 100,
			id: "fechaInicio",
		},
		{
			field: "fechaFin",
			headerName: "Fin",
			width: 100,
			id: "fechaFin",
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
					key='campaniaProfile'
					to={`/campanias/${params.id}`}
					component={NavLink}
					sx={{ fontSize: 11, mr: 1 }}
				>
					Ver detalles
				</Button>,
			];
			if (!props.borrados) {
				actions.push(
					<Button
						color={"success"}
						variant='contained'
						key='perros'
						to={`/campanias/donar/${params.row.nombre}`}
						component={NavLink}
						sx={{ fontSize: 11, mr: 1 }}
					>
						Donar
					</Button>
				);
			}
			if (esVeterinario && !props.borrados) {
				// Si esta en los borrados no debe mostrar el boton de borrado.
				actions.push(
					<Tooltip key='delete' title='Eliminar'>
						<GridActionsCellItem
							icon={<Delete />}
							label='Delete'
							onClick={() => {
								setCampaniaBorrar(params.row.id);
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
						key='perros'
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
	});

	// Si se recibe en los parametros el parametro borrado, debe hacer un fetch pero mostrando las campanias viejas/borradas.
	if (!props.borrados) {
		// Asigna a las filas las campanias actuales obtenidas de la bd
		useEffect(() => {
			obtenerCampaniasActuales().then((rows) => setRows(rows));
		}, []);
	} else {
		// Debe mostrar las campañas viejas
		useEffect(() => {
			obtenerCampaniasBorradas().then((rows) => setRows(rows));
		}, []);
	}

	// Manejador del boton de recuperar
	async function handleRecuperar(id) {
		const response = await fetch(url + "campanias/recover/" + id, {
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
				window.location.replace("/campanias/");
			}, 1000);
			return;
		}
		setSnackbar({
			children: "Error al conectar con la base de datos",
			severity: "error",
		});
	}

	// Obtiene las campanias borradas/pasadas de la BD
	async function obtenerCampaniasBorradas() {
		try {
			const response = await fetch(url + "campanias/borradas", {
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
						children: "Error al mostrar las campañas",
						severity: "error",
					});
				}
				return [];
			}
			let campains = await response.json();
			if (campains.length == 0) {
				setSnackbar({
					children:
						"La lista de campañas borradas/finalizadas se encuentra vacia",
					severity: "info",
				});
			}
			return campains;
		} catch (error) {
			console.error("Error en el fetch: " + error);

			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
			return [];
		}
	}

	// Obtiene las campanias de la BD
	async function obtenerCampaniasActuales() {
		try {
			const response = await fetch(url + "campanias/", {
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
						children: "Error al mostrar las campañas",
						severity: "error",
					});
				}
				return [];
			}
			let perros = await response.json();
			if (perros.length == 0) {
				setSnackbar({
					children: "La lista de campañas se encuentra vacia",
					severity: "info",
				});
			}
			return perros;
		} catch (error) {
			console.error("Error en el fetch: " + error);

			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
			return [];
		}
	}

	// Manejador del borrado de las campañas, como el borrado es logico simplemente hace una modificacion
	// de la campania modificando su booleano "borrado" poniendolo en true.
	async function eliminarCampania(id) {
		const response = await fetch(url + "campanias/delete/" + id, {
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
				children: "Campaña eliminada con exito",
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

	// Para cambiar el mensaje que muestra si no hay campañas
	const CustomNoRowsOverlay = () => {
		return (
			<GridOverlay>
				<div>No hay campañas registradas</div>
			</GridOverlay>
		);
	};

	// Variables para mostrar los mensajes de confirmar eliminacion
	const [openConfirmar, setOpenConfirmar] = useState(false);
	const [campaniaBorrar, setCampaniaBorrar] = useState();

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
				aria-labelledby='confirmar-title'
				aria-describedby='confirmar-description'
			>
				<DialogTitle id='confirmar-title'>
					¿Estás seguro/a de <b style={{ color: "red" }}>eliminar</b> la
					campaña?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='confirmar-description'>
						Una vez que confirmes, esta se moverá al listado de campañas
						borradas. Podrás recuperarla desde allí.
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
							eliminarCampania(campaniaBorrar);
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

export default TablaCampanias;
