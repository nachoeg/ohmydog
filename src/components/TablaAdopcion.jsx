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
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridOverlay } from '@mui/x-data-grid';
import { useCallback, useContext, useEffect, useState } from 'react';
import url from '../data/url';
import { Context } from '../context/Context';
import { CheckCircle, Delete, Done, Email, Send } from '@mui/icons-material';
import emailjs from 'emailjs-com';

function TablaAdopcion() {
	const token = localStorage.getItem('jwt');
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
		{ field: 'nombre', headerName: 'Nombre', width: 100, editable: true },
		{
			field: 'raza',
			headerName: 'Raza',
			width: 200,
			editable: true,
		},
		{
			field: 'sexo',
			headerName: 'Sexo',
			width: 100,
			editable: true,
		},
		{
			field: 'caracteristicas',
			headerName: 'Caracteristicas',
			width: 160,
			editable: true,
		},
		{
			field: 'enfermedades',
			headerName: 'Enfermedades',
			width: 250,
			editable: true,
		},
		{
			field: 'telefono',
			headerName: 'Teléfono',
			width: 100,
			editable: true,
		},
		{
			field: 'email',
			headerName: 'Email',
			width: 200,
			editable: true,
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
		width: 100,
		renderCell: (params) => {
			const data = params.row;
			return (
				<>
					{(!usuario ||
						(data.idUsuario != usuario.id && usuario.rol != 'veterinario')) &&
						data.estado != 'Adoptado' && (
							<Tooltip title="Solicitar adopción">
								<GridActionsCellItem
									icon={<Email />}
									key="solicitar"
									label="Solicitar"
									onClick={() => {
										let perroSolicitado = { ...data };
										// perroSolicitado.estado = 'Solicitado';
										handleClickOpenConfirmarSolicitar();
										setPerroSolicitado(perroSolicitado);
									}}
									sx={{
										'&:hover': {
											color: 'primary.main',
										},
									}}
								/>
							</Tooltip>
						)}

					{!!usuario &&
						(usuario.rol == 'veterinario' || data.idUsuario == usuario.id) &&
						data.estado != 'Adoptado' && (
							<>
								<Tooltip title="Confirmar adopción">
									<GridActionsCellItem
										icon={<CheckCircle />}
										key="adoptado"
										label="Adoptado"
										onClick={() => {
											let perroAdoptado = { ...data };
											// perroAdoptado.estado = 'Adoptado';
											handleClickOpenConfirmarAdopcion();
											setPerroAdoptado(perroAdoptado);
										}}
										sx={{
											'&:hover': {
												color: 'green',
											},
										}}
									/>
								</Tooltip>
								<Tooltip title="Eliminar perro">
									<GridActionsCellItem
										icon={<Delete />}
										key="eliminar"
										label="Eliminar"
										onClick={() => {
											let perroEliminar = { ...data };
											handleClickOpenConfirmarEliminar();
											setPerroEliminar(perroEliminar);
										}}
										sx={{
											'&:hover': {
												color: 'red',
											},
										}}
									/>
								</Tooltip>
							</>
						)}
				</>
			);
		},
	});

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

	const handleConfirmarSolicitar = (perro) => {
		//enviar mail
		sendEmail(event, perro);
	};

	function sendEmail(e, p) {
		e.preventDefault();
		e.target.elements.password.value = p; // habria que mandar los detalles del perro?
		emailjs
			.sendForm(
				'service_xg4z6nu',
				'template_xjzci4t',
				e.target,
				'kMhWmQA84AfcGvqNF'
			)
			.then(
				(result) => {
					console.log(result.text);
				},
				(error) => {
					setSnackbar({
						children: 'Error al conectar con la base de datos' + error,
						severity: 'error',
					});
				}
			);
	}

	const handleConfirmarAdopcion = async (perro) => {
		const response = await fetch(url + 'adopciones/modify/' + perro.id, {
			method: 'put',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
		});
		if (response.ok) {
			setTimeout(
				() =>
					setSnackbar({
						children: 'Perro marcado como adoptado con exito',
						severity: 'success',
					}),
				1000
			);
			actualizarTabla();
		}
		if (response.status == 500) {
			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
		}
	};

	const handleConfirmarEliminar = async (perro) => {
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
					children: 'Perro eliminado con exito',
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
				isCellEditable={(params) => {
					return (
						usuario &&
						(params.row.idUsuario == usuario.id || usuario.rol == 'veterinario')
					);
				}}
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
			<Dialog
				open={openConfirmarEliminar}
				onClose={handleCloseConfirmarEliminar}
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
							color: 'red',
						}}
					>
						eliminar
					</Typography>{' '}
					el perro?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="confirmar-description">
						Una vez que confirmes, no podrás deshacer esta acción
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color="error"
						variant="outlined"
						onClick={handleCloseConfirmarEliminar}
					>
						Cancelar
					</Button>
					<Button
						variant="contained"
						color="error"
						startIcon={<Delete />}
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
