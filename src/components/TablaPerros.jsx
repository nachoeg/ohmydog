import { Context } from '../context/Context';
import { useEffect, useState, useCallback, useContext } from 'react';
import url from '../data/url';
import { DataGrid, GridActionsCellItem, GridOverlay } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Delete from '@mui/icons-material/DeleteForever';
import { razas } from '../data/perros';

// La tabla de perros recibe en props el id del usuario que va a mostrar los perros
function TablaPerros(props) {
	const { usuario } = useContext(Context); // Usuario con sesion activa del que se muestran los perros
	const token = localStorage.getItem('jwt');

	const [esVeterinario, setEsVeterinario] = useState(false); // Para ocultar o mostrar funciones de veterinarios

	//Habilita/muestra opciones en funcion de si entra un veterinario.
	useEffect(() => {
		if (usuario != null && usuario.rol === 'veterinario') {
			setEsVeterinario(true);
		}
	}, [usuario]);

	// Declara una snackbar para mostrar mensajes
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null); // Manejador del cierre de la snackbar

	const [rows, setRows] = useState([]); // Filas de la tabla de perros a mostrar

	// Asigna a las filas los perros obtenidos de la BD.
	useEffect(() => {
		obtenerPerros().then((rows) => setRows(rows));
	}, []);

	// Manejador del borrado de los perros
	const handleDeleteClick = (id) => async () => {
		const response = await fetch(url + 'perros/delete/' + id, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
		});
		console.log(response);
		if (response.ok) {
			setSnackbar({
				children: 'Perro eliminado con exito',
				severity: 'success',
			});
			setRows(rows.filter((row) => row.id !== id));
		} else {
			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
		}
	};

	// Obtiene los perros del usuario desde la BD.
	async function obtenerPerros() {
		try {
			const response = await fetch(url + 'perros/' + props.idUsuario, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					token: `${token}`,
				},
			});
			if (!response.ok) {
				if (response.status == 401) {
					setSnackbar({
						children: 'No estas autorizado para ver los perros',
						severity: 'error',
					});
				}
				return [];
			}
			let perros = await response.json();
			if (perros.length == 0) {
				setSnackbar({
					children: 'La lista de perros se encuentra vacia',
					severity: 'info',
				});
			}
			return perros;
		} catch (error) {
			console.error('Error en el fetch: ' + error);

			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
			return [];
		}
	}

	// Establece las columnas a mostrar de la tabla de perros.
	const columns = [
		// Datos de los perros: ID, nombre, raza, edad, enfermedad, sexo y caracteristicas
		{ field: 'id', headerName: 'ID', width: 50, id: 'id' },
		{ field: 'nombre', headerName: 'Nombre', width: 100, editable: true },
		{
			field: 'raza',
			headerName: 'Raza',
			width: 150,
			type: 'singleSelect',
			valueOptions: razas,
			editable: true,
		},
		{
			field: 'sexo',
			headerName: 'Sexo',
			width: 100,
			type: 'singleSelect',
			valueOptions: ['Masculino', 'Femenino'],
			editable: true,
		},
		{
			field: 'caracteristicas',
			headerName: 'Caracteristicas',
			width: 300,
			editable: true,
		},
		{
			field: 'enfermedad',
			headerName: 'Enfermedades',
			width: 400,
			editable: true,
		},
	];

	// Funcion para validar los datos al modificarlos
	function validarDatos(datos) {
		return (
			datos.nombre.trim() !== '' &&
			datos.edad.toString().trim() !== '' &&
			datos.raza.trim() !== '' &&
			// datos.caracteristicas.trim() !== '' &&
			// datos.enfermedad.trim() !== '' &&
			datos.sexo.trim() !== ''
		);
	}

	// Fetch de modificacion de los datos de un perro
	const processRowUpdate = useCallback(async (newRow, oldRow) => {
		if (!validarDatos(newRow)) {
			setSnackbar({
				children: 'No puede ingresar un campo vacio.',
				severity: 'error',
			});
			return oldRow;
		}
		const response = await fetch(url + 'perros/modify/' + newRow.id, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
			body: JSON.stringify(newRow),
		});
		if (response.ok) {
			setSnackbar({
				children: 'Perro modificado con exito',
				severity: 'success',
			});
			return newRow;
		}
		if (response.status == 500) {
			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
		}
		return oldRow;
	}, []);

	// Manejador de errores en el update (modificacion)
	const handleProcessRowUpdateError = useCallback((error) => {
		setSnackbar({ children: error.message, severity: 'error' });
	}, []);

	// Si es veterinario se agrega la columna que permite borrar
	if (esVeterinario) {
		columns.push({
			field: 'actions',
			type: 'actions',
			width: 50,
			cellClassName: 'actions',
			getActions: ({ id }) => {
				return [
					<GridActionsCellItem
						icon={<Delete />}
						key=""
						label="Delete"
						onClick={handleDeleteClick(id)}
						color="inherit"
					/>,
				];
			},
		});
	}

	// Para cambiar el mensaje que muestra si no hay perros
	const CustomNoRowsOverlay = () => {
		return (
			<GridOverlay>
				<div>No hay perros cargados</div>
			</GridOverlay>
		);
	};

	return (
		<div style={{ height: 400, width: '100%' }}>
			<DataGrid
				editMode="row"
				rows={rows}
				columns={columns}
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

			{!!snackbar && (
				// Declaracion de propiedades de la snackbar
				<Snackbar
					open
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					onClose={handleCloseSnackbar}
					autoHideDuration={6000}
				>
					<Alert {...snackbar} onClose={handleCloseSnackbar} />
				</Snackbar>
			)}
		</div>
	);
}

export default TablaPerros;
