import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Snackbar,
	Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridOverlay } from '@mui/x-data-grid';
import { useCallback, useContext, useEffect, useState } from 'react';
import url from '../data/url';
import { Context } from '../context/Context';
import { CheckCircle, Done, Email, Send } from '@mui/icons-material';

function TablaAdopcion() {
	const token = localStorage.getItem('jwt');
	const { usuario } = useContext(Context);

	const [rows, setRows] = useState([]);

	const [perroSolicitado, setPerroSolicitado] = useState({});
	const [perroAdoptado, setPerroAdoptado] = useState({});

	useEffect(() => {
		actualizarTabla();
	}, []);

	function actualizarTabla() {
		obtenerPerros().then((rows) => setRows(rows));
	}

	async function obtenerPerros() {
		try {
			const response = await fetch(url + 'adopciones/', {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					token: `${token}`,
				},
			});
			if (!response.ok) {
				setSnackbar({
					children:
						'Ocurrió un error al intentar cargar la lista de perros en adopción',
					severity: 'error',
				});
				return [];
			}
			let perros = await response.json();
			if (perros.length == 0) {
				setSnackbar({
					children: 'La lista de perros en adopción se encuentra vacía',
					severity: 'info',
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
						if (a.estado == 'Adoptado') {
							return 1;
						}
						if (a.estado == 'Pendiente') {
							return -1;
						}
					})
			);
		} catch (error) {
			console.error('Error en el fetch: ' + error);

			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
			return [];
		}
	}

	const columns = [
		// Datos de los perros: ID, nombre, raza, edad, enfermedad, sexo y caracteristicas
		{ field: 'id', id: 'id' },
		{ field: 'idUsuario', id: 'idUsuario' },
		{ field: 'nombre', headerName: 'Nombre', width: 100 },
		{
			field: 'raza',
			headerName: 'Raza',
			width: 200,
		},
		{
			field: 'sexo',
			headerName: 'Sexo',
			width: 100,
		},
		{
			field: 'caracteristicas',
			headerName: 'Caracteristicas',
			width: 160,
		},
		{
			field: 'enfermedades',
			headerName: 'Enfermedades',
			width: 300,
		},
		{
			field: 'telefono',
			headerName: 'Teléfono',
			width: 100,
		},
		{
			field: 'email',
			headerName: 'Email',
			width: 200,
		},
		{
			//si esta adoptado o no
			field: 'estado',
			headerName: 'Estado',
			width: 100,
		},
	];

	columns.push({
		field: 'actions',
		headerName: '',
		width: 50,
		renderCell: (params) => {
			const data = params.row;
			return (
				<>
					{(!usuario ||
						(data.idUsuario != usuario.id && usuario.rol != 'veterinario')) &&
						data.estado != 'Adoptado' && (
							<GridActionsCellItem
								icon={<Email />}
								key="solicitar"
								label="Solicitar"
								onClick={() => {
									let perroSolicitado = { ...data };
									perroSolicitado.estado = 'Adoptado';
									handleClickOpenConfirmarSolicitar();
									setPerroSolicitado(perroSolicitado);
								}}
								sx={{
									'&:hover': {
										color: 'primary.main',
									},
								}}
							/>
						)}
					{!!usuario &&
						(usuario.rol == 'veterinario' || data.idUsuario == usuario.id) &&
						data.estado != 'Adoptado' && (
							<GridActionsCellItem
								icon={<CheckCircle />}
								key="adoptado"
								label="Adoptado"
								onClick={() => {
									let perroAdoptado = { ...data };
									perroAdoptado.estado = 'Adoptado';
									handleClickOpenConfirmarAdopcion();
									setPerroAdoptado(perroAdoptado);
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

	const [openConfirmarSolicitar, setOpenConfirmarSolicitar] = useState(false);
	const [openConfirmarAdopcion, setOpenConfirmarAdopcion] = useState(false);

	const handleClickOpenConfirmarSolicitar = () => {
		setOpenConfirmarSolicitar(true);
	};
	const handleClickOpenConfirmarAdopcion = () => {
		setOpenConfirmarAdopcion(true);
	};
	const handleCloseConfirmarSolicitar = () => {
		setOpenConfirmarSolicitar(false);
	};
	const handleCloseConfirmarAdopcion = () => {
		setOpenConfirmarAdopcion(false);
	};

	const handleConfirmarSolicitar = (perro) => {
		//enviar mail
		console.log(perro);
	};

	const handleConfirmarAdopcion = async (perro) => {
		console.log(perro);
		const response = await fetch(url + 'adopciones/delete/' + perro.id, {
			method: 'delete',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
		});
		if (response.ok) {
			setTimeout(() => {
				setSnackbar({
					children: 'Perro marcado como adoptado con exito',
					severity: 'success',
				});
			}, 1000);
			actualizarTabla();
		}
		if (response.status == 500) {
			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
		}
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
					//deberia poder verse el email y el telefono?
					// email: false,
					// telefono: false,
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
				open={openConfirmarAdopcion}
				onClose={handleCloseConfirmarAdopcion}
				aria-labelledby="confirmar-title"
				aria-describedby="confirmar-description"
			>
				<DialogTitle id="confirmar-title">
					Estas seguro/a de <b style={{ color: 'green' }}>confirmar</b> que el
					perro fue adoptado?
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
						onClick={handleCloseConfirmarAdopcion}
					>
						Cancelar
					</Button>
					<Button
						variant="contained"
						color="success"
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
				aria-labelledby="confirmar-title"
				aria-describedby="confirmar-description"
			>
				<DialogTitle id="confirmar-title">
					Estas seguro/a de{' '}
					<Typography
						component={'span'}
						sx={{
							fontWeight: 'bold',
							fontSize: 'inherit',
							color: 'primary.main',
						}}
					>
						solicitar
					</Typography>{' '}
					la adopción del perro?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="confirmar-description">
						Una vez que confirmes, se le enviará un mail al dueño del perro con
						tu solicitud y tus datos, para que puedan contactarse.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color="primary"
						variant="outlined"
						onClick={handleCloseConfirmarSolicitar}
					>
						Cancelar
					</Button>
					<Button
						variant="contained"
						color="primary"
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
