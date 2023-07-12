import { Context } from "../context/Context";
import { useEffect, useState, useCallback, useContext } from "react";
import url from "../data/url";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";

// Esta tabla carga segun una de dos cosas:
// 1) Entra alguien logueado y se le muestran sus perros disponibles para cruzar con su boton para ver las opciones.
// 2) Entra alguien no logueado/el veterinario y muestra todos los perros marcados para cruzar junto con el numero de telefono del dueño.
function TablaCruzas() {
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

	// Establece las columnas a mostrar de la tabla de cruzas
	const columns = [
		// Datos de los perros a mostrar: Nombre
		{ field: "id", headerName: "ID", width: 50, id: "id" },
		{
			field: "nombre",
			headerName: "Nombre",
			width: 100,
			id: "nombre",
		},
		{
			field: "edad",
			headerName: "Edad (meses)",
			width: 100,
			id: "edad",
		},
		{
			field: "raza",
			headerName: "Raza",
			width: 100,
			type: "singleSelect",
		},
		{
			field: "sexo",
			headerName: "Sexo",
			width: 100,
			valueOptions: ["Macho", "Hembra"],
		},
		{
			field: "caracteristicas",
			headerName: "Caracteristicas",
			width: 250,
		},
	];

	if (esVeterinario || usuario == null) {
		useEffect(() => {
			obtenerTodosLosPerrosDisponibleCruza().then((rows) => setRows(rows));
		}, []);
		columns.push({
			field: "usuarioTelefono",
			headerName: "Telefono",
			width: 150,
			id: "usuarioTelefono",
		});
		columns.push({
			field: "usuarioNombreyApellido",
			headerName: "Dueño",
			width: 150,
			id: "usuarioNombreyApellido",
		});
	} else {
		// Si es un usuario logueado muestra sus perros marcados como disponibles para cruza
		// fetch que devuelve los perros marcados disponibles para cruza mediante id
		useEffect(() => {
			obtenerPerrosDisponibleCruzaCliente().then((rows) => setRows(rows));
		}, []);
		// Establece las acciones de cada fila y si es veterinario muestra el borrado
		columns.push({
			field: "actions",
			headerName: "",
			minWidth: 300,
			align: "right",
			flex: 1,
			renderCell: (params) => {
				const { id, nombre } = params.row;

				const actions = [
					<Button
						key='turnos'
						component={NavLink}
						to={`/opcionesDeCruza/` + id + "/" + nombre}
						sx={{ mr: 1, fontSize: 11 }}
						color='success'
					>
						Opciones de cruza
					</Button>,
					<Button
						key='eliminarDeCruzas'
						onClick={() => eliminarDeCruza(id)}
						sx={{ mr: 1, fontSize: 11 }}
						color='error'
					>
						Eliminar de cruzas
					</Button>,
				];

				return <>{actions}</>;
			},
		});
	}

	function eliminarDeCruza(id) {
		console.log(id);
		const response = fetch(url + "perros/cruzar/" + id, {
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
					children: "Se elimino el perro del listado de cruzas",
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

	// Obtiene los perros del sistema que estan disponible para cruzar mediante el id del dueño
	async function obtenerPerrosDisponibleCruzaCliente() {
		try {
			const response = await fetch(
				url + "perros/disponiblesCruza/" + usuario.id,
				{
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						token: `${token}`,
					},
				}
			);
			if (!response.ok) {
				if (response.status == 401) {
					setSnackbar({
						children: "Error al mostrar los perros",
						severity: "error",
					});
				}
				return [];
			}
			let dogs = await response.json();
			if (dogs.length == 0) {
				setSnackbar({
					children:
						"La lista de perros disponible para cruzar se encuentra vacia",
					severity: "info",
				});
			}
			console.log(dogs);
			return dogs;
		} catch (error) {
			console.error("Error en el fetch: " + error);
			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
			return [];
		}
	}

	// Obtiene todos los perros del sistema que estan disponible para cruzar
	async function obtenerTodosLosPerrosDisponibleCruza() {
		try {
			const response = await fetch(url + "perros/disponiblesCruza/", {
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
						children: "Error al mostrar los perros",
						severity: "error",
					});
				}
				return [];
			}
			let dogs = await response.json();
			if (dogs.length == 0) {
				setSnackbar({
					children:
						"La lista de perros disponible para cruzar se encuentra vacia",
					severity: "info",
				});
			}
			return dogs;
		} catch (error) {
			console.error("Error en el fetch: " + error);
			setSnackbar({
				children: "Error al conectar con la base de datos",
				severity: "error",
			});
			return [];
		}
	}

	// Para cambiar el mensaje que muestra si no hay perros
	const CustomNoRowsOverlay = () => {
		return (
			<GridOverlay>
				<div>No hay perros marcados como disponibles para cruzar</div>
			</GridOverlay>
		);
	};

	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columns}
				editMode='row'
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

export default TablaCruzas;
