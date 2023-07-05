import { Context } from '../context/Context';
import { useEffect, useState, useCallback, useContext } from 'react';
import url from '../data/url';
import {
	DataGrid,
	GridActionsCellItem,
	GridOverlay,
	GridRowModes,
} from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Delete from '@mui/icons-material/DeleteForever';
import { razas } from '../data/perros';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import {
	AssignmentOutlined,
	CalendarMonth,
	Cancel,
	Edit,
	Save,
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';

// La tabla de perros recibe en props el id del usuario que va a mostrar los perros
function TablaPerros(props) {
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
	async function eliminarPerro(id) {
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
	}

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
		{
			field: 'nombre',
			headerName: 'Nombre',
			width: 100,
			id: 'nombre',
			editable: true,
		},
		{
			field: 'usuarioNombreyApellido',
			headerName: 'Dueño',
			width: 120,
			id: 'usuarioNombreyApellido',
		},
		{
			field: 'edad',
			headerName: 'Edad (meses)',
			width: 100,
			id: 'edad',
			type: 'number',
			editable: true,
		},
		{
			field: 'raza',
			headerName: 'Raza',
			width: 100,
			type: 'singleSelect',
			valueOptions: razas,
			editable: true,
		},
		{
			field: 'sexo',
			headerName: 'Sexo',
			width: 100,
			type: 'singleSelect',
			valueOptions: ['Macho', 'Hembra'],
			editable: true,
		},
		{
			field: 'caracteristicas',
			headerName: 'Caracteristicas',
			width: 250,
			editable: true,
		},
	];

	// Funcion para validar los datos al modificarlos
	function validarDatos(datos) {
		return (
			datos.nombre.trim() != '' &&
			datos.edad != null &&
			datos.raza.trim() != '' &&
			// datos.caracteristicas.trim() !== '' &&
			// datos.enfermedad.trim() !== '' &&
			datos.sexo.trim() != ''
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

	// Establece las acciones de cada fila y si es veterinario muestra el borrado
	columns.push({
		field: 'actions',
		headerName: '',
		minWidth: 300,
		align: 'right',
		flex: 1,
		renderCell: (params) => {
			const { id, nombre } = params.row;
			const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

			const actions = [
				<Button
					key="turnos"
					startIcon={<CalendarMonth />}
					component={NavLink}
					to={`/turnos/perro/${id}/${nombre}`}
					sx={{ mr: 1, fontSize: 11 }}
				>
					Turnos
				</Button>,
				<Button
					key="historial"
					startIcon={<AssignmentOutlined />}
					component={NavLink}
					to={`/historial-clinico/${id}`}
					sx={{ mr: 1, fontSize: 11 }}
				>
					Historial clínico
				</Button>,
			];

			if (isInEditMode) {
				actions.push(
					<Tooltip title="Guardar" key="save">
						<GridActionsCellItem
							icon={<Save />}
							label="Save"
							onClick={handleSaveClick(id)}
							sx={{ '&:hover': { color: 'primary.main' } }}
						/>
					</Tooltip>,
					<Tooltip title="Cancelar" key="cancel">
						<GridActionsCellItem
							icon={<Cancel />}
							label="Cancel"
							className="textPrimary"
							onClick={handleCancelClick(id)}
							sx={{ '&:hover': { color: 'red' } }}
						/>
					</Tooltip>
				);
			} else {
				actions.push(
					<Tooltip key="edit" title="Editar">
						<GridActionsCellItem
							icon={<Edit />}
							label="Edit"
							className="textPrimary"
							onClick={handleEditClick(id)}
							sx={{ '&:hover': { color: 'primary.main' } }}
						/>
					</Tooltip>
				);
				if (esVeterinario) {
					actions.push(
						<Tooltip key="delete" title="Eliminar">
							<GridActionsCellItem
								icon={<Delete />}
								label="Delete"
								onClick={() => {
									setPerroBorrar(id);
									handleClickOpenConfirmar();
								}}
								sx={{ '&:hover': { color: 'red' } }}
							/>
						</Tooltip>
					);
				}
			}

			return <>{actions}</>;
		},
	});

	const [openConfirmar, setOpenConfirmar] = useState(false);

	const [perroBorrar, setPerroBorrar] = useState();

	const handleClickOpenConfirmar = () => {
		setOpenConfirmar(true);
	};

	const handleCloseConfirmar = () => {
		setOpenConfirmar(false);
	};

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
				rows={rows}
				columns={columns}
				editMode="row"
				columnVisibilityModel={{
					id: false,
					usuarioNombreyApellido: props.idUsuario == '',
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
				open={openConfirmar}
				onClose={handleCloseConfirmar}
				aria-labelledby="confirmar-title"
				aria-describedby="confirmar-description"
			>
				<DialogTitle id="confirmar-title">
					Estas seguro/a de <b style={{ color: 'red' }}>eliminar</b> al perro?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="confirmar-description">
						Una vez que confirmes, también se eliminarán todos los turnos
						asociados al perro.
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
							eliminarPerro(perroBorrar);
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
