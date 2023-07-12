import { Context } from "../context/Context";
import { useEffect, useState, useCallback, useContext } from "react";
import url from "../data/url";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom"; // Para obtener el parametro pasado por la url
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";

// Esta pagina muestra basicamente una tarjeta que muestre una primer opcion
// (al estilo de "principal")
// y despues un listado de otras opciones.

function OpcionesDeCruza() {
	// Obtiene el id del perro que se pasa como parametro en la url
	const location = useLocation();
	const idPerro = location.pathname.split("/")[2];
	const nombrePerro = location.pathname.split("/")[3].replace(/%20/g, " ");

	const token = localStorage.getItem("jwt");

	// Declara una snackbar para mostrar mensajes
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null); // Manejador del cierre de la snackbar

	// Declaracion de columnas
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

	useEffect(() => {
		obtenerOpcionesDeCruza().then((rows) => setRows(rows));
	}, []);

	// Obtiene todos los perros del sistema que estan disponible para cruzar
	async function obtenerOpcionesDeCruza() {
		try {
			const response = await fetch(url + "perros/opcionesCruza/" + idPerro, {
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
					children: "La lista de opciones para cruzar se encuentra vacia",
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
				<div>No hay más opciones para mostrar.</div>
			</GridOverlay>
		);
	};

	return (
		<Container
			component='main'
			maxWidth='lg'
			sx={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				mt: 4,
			}}
		>
			<Typography component='h2' variant='h5'>
				Opciones de cruza para {nombrePerro}
			</Typography>
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
		</Container>
	);
}

export default OpcionesDeCruza;
