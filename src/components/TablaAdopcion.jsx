import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Snackbar,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridOverlay } from '@mui/x-data-grid';
import { useCallback, useContext, useEffect, useState } from 'react';
import { razas } from '../data/perros';
import url from '../data/url';
import { Context } from '../context/Context';
import { CheckCircle, Pets } from '@mui/icons-material';

function TablaAdopcion() {
	const token = localStorage.getItem('jwt');
	const { usuario } = useContext(Context);

	const [rows, setRows] = useState([]);

	const [perro, setPerro] = useState({});

	useEffect(() => {
		actualizarTabla();
	}, []);

	function actualizarTabla() {
		obtenerPerros().then((rows) => setRows(rows));
	}

	async function obtenerPerros() {
		//algoritmo para ordenar primero a los perros del usuario, y despues a los perros restantes
		let filas = [
			{ id: '1', idUsuario: '1', nombre: 'perro', estado: 'Pendiente' },
			{ id: '2', idUsuario: '2', nombre: 'perro2', estado: 'Adoptado' },
			{ id: '3', idUsuario: '3', nombre: 'perro3', estado: 'Adoptado' },
			{ id: '4', idUsuario: '3', nombre: 'perro3', estado: 'Pendiente' },
			{ id: '5', idUsuario: '2', nombre: 'perro', estado: 'Pendiente' },
		];
		//criterios de orden
		//por id del perro
		filas.sort((a, b) => a.id - b.id);
		//primero los del usuario actual
		filas.sort((a) => {
			if (usuario) {
				if (a.idUsuario == usuario.id) {
					return 1;
				}
				return -1;
			}
		});
		//ultimos los adoptados
		filas.sort((a) => {
			if (a.estado == 'Adoptado') {
				return 1;
			}
			if (a.estado == 'Pendiente') {
				return -1;
			}
		});
		return filas;
	}

	// // esto deberia ser solo de los perros en adopcion (cambiar url)
	// async function obtenerPerros() {
	// 	try {
	// 		const response = await fetch(url + 'perros/', {
	// 			method: 'GET',
	// 			credentials: 'include',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				token: `${token}`,
	// 			},
	// 		});
	// 		if (!response.ok) {
	// 			if (response.status == 401) {
	// 				setSnackbar({
	// 					children: 'No estas autorizado para ver los perros',
	// 					severity: 'error',
	// 				});
	// 			}
	// 			return [];
	// 		}
	// 		let perros = await response.json();
	// 		if (perros.length == 0) {
	// 			setSnackbar({
	// 				children: 'La lista de perros se encuentra vacia',
	// 				severity: 'info',
	// 			});
	// 		}
	// 		return perros;
	// 	} catch (error) {
	// 		console.error('Error en el fetch: ' + error);

	// 		setSnackbar({
	// 			children: 'Error al conectar con la base de datos',
	// 			severity: 'error',
	// 		});
	// 		return [];
	// 	}
	// }

	const columns = [
		// Datos de los perros: ID, nombre, raza, edad, enfermedad, sexo y caracteristicas
		{ field: 'id', headerName: 'ID', width: 50, id: 'id' },
		{ field: 'idUsuario', id: 'idUsuario' },
		{ field: 'nombre', headerName: 'Nombre', width: 100 },
		{
			field: 'raza',
			headerName: 'Raza',
			width: 150,
			type: 'singleSelect',
			valueOptions: razas,
		},
		{
			field: 'sexo',
			headerName: 'Sexo',
			width: 100,
			type: 'singleSelect',
			valueOptions: ['Masculino', 'Femenino'],
		},
		{
			field: 'caracteristicas',
			headerName: 'Caracteristicas',
			width: 250,
		},
		{
			field: 'enfermedad',
			headerName: 'Enfermedades',
			width: 250,
		},
		{
			//si esta adoptado o no
			field: 'estado',
			headerName: 'Estado',
			width: 100,
		},
	];

	if (!usuario || usuario.rol == 'cliente') {
		columns.push({
			field: 'actions',
			headerName: '',
			width: 50,
			renderCell: (params) => {
				const data = params.row;
				return (
					<>
						{(!usuario || data.idUsuario != usuario.id) &&
							data.estado != 'Adoptado' && (
								<GridActionsCellItem
									icon={<Pets />}
									key="adoptado"
									label="Adoptado"
									onClick={() => {
										let perroAdoptar = { ...data };
										perroAdoptar.estado = 'Adoptado';
										handleClickOpenConfirmar();
										setPerro(perroAdoptar);
									}}
									sx={{
										'&:hover': {
											color: 'green',
										},
									}}
								/>
							)}
						{!!usuario &&
							data.idUsuario == usuario.id &&
							data.estado != 'Adoptado' && (
								<GridActionsCellItem
									icon={<CheckCircle />}
									key="adoptado"
									label="Adoptado"
									onClick={() => {
										let perroAdoptar = { ...data };
										perroAdoptar.estado = 'Adoptado';
										handleClickOpenConfirmar();
										setPerro(perroAdoptar);
									}}
									sx={{
										'&:hover': {
											color: 'green',
										},
									}}
								/>
							)}
					</>
				);
			},
		});
	}

	const [openConfirmar, setOpenConfirmar] = useState(false);

	const handleClickOpenConfirmar = () => {
		setOpenConfirmar(true);
	};
	const handleCloseConfirmar = () => {
		setOpenConfirmar(false);
	};

	const handleConfirmarAdopcion = async (newRow) => {
		console.log(newRow);
		//cambiar url a la que sea para marcar al perro como adoptado
		// const response = await fetch(url + 'perros/adopcion/modify/' + newRow.id, {
		// 	method: 'PUT',
		// 	credentials: 'include',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		token: `${token}`,
		// 	},
		// 	body: JSON.stringify(newRow),
		// });
		// if (response.ok) {
		// 	setSnackbar({
		// 		children: 'Turno procesado con exito',
		// 		severity: 'success',
		// 	});
		// 	actualizarTabla();
		// }
		// if (response.status == 500) {
		// 	setSnackbar({
		// 		children: 'Error al conectar con la base de datos',
		// 		severity: 'error',
		// 	});
		// }
	};

	const [snackbar, setSnackbar] = useState(null);

	const handleCloseSnackbar = () => setSnackbar(null);

	const handleProcessRowUpdateError = useCallback((error) => {
		setSnackbar({ children: error.message, severity: 'error' });
	}, []);

	const CustomNoRowsOverlay = () => {
		return (
			<GridOverlay>
				<div>No hay perros en adopción cargados</div>
			</GridOverlay>
		);
	};
	return (
		<div style={{ height: 400, width: '100%' }}>
			<DataGrid
				editMode="row"
				rows={rows}
				columns={columns}
				columnVisibilityModel={{
					id: false,
					idUsuario: false,
				}}
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
					Estas seguro/a de <b style={{ color: 'green' }}>confirmar</b> la
					adopcion del perro?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="confirmar-description">
						Una vez que confirmes, se actualizará su estado y no se podrá
						revertir
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color="success"
						variant="outlined"
						onClick={handleCloseConfirmar}
					>
						Cancelar
					</Button>
					<Button
						variant="contained"
						color="success"
						onClick={() => {
							handleConfirmarAdopcion(perro);
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

export default TablaAdopcion;
