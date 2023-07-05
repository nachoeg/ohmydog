import { useEffect, useState, useCallback, useContext } from 'react';
import url from '../data/url';
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { GridOverlay } from '@mui/x-data-grid';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { CheckCircle, DoNotDisturbOn, Unpublished } from '@mui/icons-material';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Tooltip,
} from '@mui/material';
import { Context } from '../context/Context';

function TablaTurnos({ urlTurnos, filtro }) {
	const token = localStorage.getItem('jwt');

	const [rows, setRows] = useState([]);

	const [turno, setTurno] = useState(null);

	const { usuario } = useContext(Context);

	useEffect(() => {
		actualizarTabla();
	}, [filtro]);

	function actualizarTabla() {
		obtenerTurnos()
			.then((rows) =>
				rows.sort((a, b) => {
					return new Date(b.fecha) - new Date(a.fecha);
				})
			)
			.then((rows) => rows.sort((a) => (a.estado == 'Pendiente' ? -1 : 1)))
			.then((rows) => {
				if (filtro == 'hoy') {
					let currentDate = new Date().toJSON().slice(0, 10);
					let newRows = rows.filter(
						(a) => new Date(a.fecha).toJSON().slice(0, 10) == currentDate
					);
					return newRows;
				}
				if (filtro == 'asistidos') {
					let newRows = rows.filter((a) => a.estado == 'Asistio');
					return newRows;
				}
				if (filtro == 'no-asistidos') {
					let newRows = rows.filter((a) => a.estado == 'Falto');
					return newRows;
				}
				return rows;
			})
			.then((rows) => setRows(rows));
	}

	async function obtenerTurnos() {
		try {
			const response = await fetch(url + 'turnos/' + urlTurnos, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					token: `${token}`,
					idCliente: `${usuario.id}`,
				},
			});
			if (!response.ok) {
				if (response.status == 401) {
					setSnackbar({
						children: 'No estas autorizado para ver los turnos',
						severity: 'error',
					});
				}
				return [];
			}
			let turnos = await response.json();
			if (turnos.length == 0) {
				setSnackbar({
					children: 'La lista de turnos se encuentra vacia',
					severity: 'info',
				});
			}
			return turnos;
		} catch (error) {
			console.error('Error en el fetch: ' + error);

			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
			return [];
		}
	}

	// const obtenerTurnos = async () => {
	// 	const response = await fetch(url + 'turnos', {
	// 		method: 'GET',
	// 		credentials: 'include',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			token: `${token}`,
	// 		},
	// 	}).catch((error) => {
	// 		console.error('Error en el fetch: ' + error);
	// 		setSnackbar({
	// 			children: 'Error al conectar con la base de datos',
	// 			severity: 'error',
	// 		});
	// 		return [];
	// 	});

	// 	console.log(response);

	// 	let turnos = [];
	// 	if (response.ok) {
	// 		turnos = await response.json();
	// 		if (turnos.length == 0) {
	// 			setSnackbar({
	// 				children: 'La lista de turnos se encuentra vacia',
	// 				severity: 'info',
	// 			});
	// 		}
	// 	} else if (response.status == 401) {
	// 		setSnackbar({
	// 			children: 'No estas autorizado para ver los turnos',
	// 			severity: 'error',
	// 		});
	// 	}

	// 	if (response.turnos.length == 0) {
	// 		setSnackbar({
	// 			children: 'La lista de turnos se encuentra vacia',
	// 			severity: 'info',
	// 		});
	// 	}
	// 	return turnos;
	// };

	const columns = [
		{
			field: 'idPerro',
			headerName: 'ID Perro',
			width: 70,
		},
		{
			field: 'nombre',
			headerName: 'Nombre',
			width: 100,
		},
		{
			field: 'fecha',
			headerName: 'Fecha',
			width: 100,
		},
		{
			field: 'motivo',
			headerName: 'Motivo',
			minWidth: 150,
			flex: 1,
		},
		{
			field: 'estado',
			headerName: 'Estado',
			width: 100,
		},
		{
			field: 'estadoBotones',
			headerName: '',
			width: 100,
			renderCell: (params) => {
				const data = params.row;
				return (
					<>
						{data.estado == 'Pendiente' && usuario.rol == 'veterinario' && (
							<>
								<Tooltip title="Aceptar">
									<GridActionsCellItem
										icon={<CheckCircle />}
										key="aceptado"
										label="Aceptado"
										onClick={() => {
											let nuevoTurno = { ...data };
											nuevoTurno.estado = 'Aceptado';
											handleClickOpenAceptar();
											setTurno(nuevoTurno);
										}}
										sx={{
											'&:hover': {
												color: 'green',
											},
										}}
									/>
								</Tooltip>
								<Tooltip title="Rechazar">
									<GridActionsCellItem
										icon={<DoNotDisturbOn />}
										key="rechazado"
										label="Rechazado"
										onClick={() => {
											let nuevoTurno = { ...data };
											nuevoTurno.estado = 'Rechazado';
											handleClickOpenRechazar();
											setTurno(nuevoTurno);
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
						{data.estado == 'Aceptado' && usuario.rol == 'veterinario' && (
							<>
								<Tooltip title="Asistio">
									<GridActionsCellItem
										icon={<CheckCircle />}
										key="asistio"
										label="Asistio"
										onClick={() => {
											let nuevoTurno = { ...data };
											nuevoTurno.estado = 'Asistio';
											handleClickOpenAsistio();
											setTurno(nuevoTurno);
										}}
										sx={{
											'&:hover': {
												color: 'green',
											},
										}}
									/>
								</Tooltip>
								<Tooltip title="Falto">
									<GridActionsCellItem
										icon={<Unpublished />}
										key="falto"
										label="Falto"
										onClick={() => {
											let nuevoTurno = { ...data };
											nuevoTurno.estado = 'Falto';
											handleClickOpenFalto();
											setTurno(nuevoTurno);
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
		},
	];

	const handleCambiarEstado = async (newRow) => {
		console.log(newRow);
		const response = await fetch(url + 'turnos/modify/' + newRow.id, {
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
				children: 'Turno procesado con exito',
				severity: 'success',
			});
			actualizarTabla();
		}
		if (response.status == 500) {
			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
		}
	};

	const handleConfirmarAceptar = () => {
		handleCambiarEstado(turno);
		handleCloseAceptar();
	};

	const handleConfirmarAsistio = () => {
		handleCambiarEstado(turno);
		handleCloseAsistio();
	};

	const handleConfirmarRechazar = () => {
		handleCambiarEstado(turno);
		handleCloseRechazar();
	};

	const handleConfirmarFalto = () => {
		handleCambiarEstado(turno);
		handleCloseFalto();
	};

	const [openAceptar, setOpenAceptar] = useState(false);
	const [openAsistio, setOpenAsistio] = useState(false);
	const [openRechazar, setOpenRechazar] = useState(false);
	const [openFalto, setOpenFalto] = useState(false);

	const handleClickOpenAceptar = () => {
		setOpenAceptar(true);
	};

	const handleCloseAceptar = () => {
		setOpenAceptar(false);
	};

	const handleClickOpenRechazar = () => {
		setOpenRechazar(true);
	};

	const handleCloseRechazar = () => {
		setOpenRechazar(false);
	};

	const handleClickOpenAsistio = () => {
		setOpenAsistio(true);
	};

	const handleCloseAsistio = () => {
		setOpenAsistio(false);
	};

	const handleClickOpenFalto = () => {
		setOpenFalto(true);
	};

	const handleCloseFalto = () => {
		setOpenFalto(false);
	};

	const [snackbar, setSnackbar] = useState(null);

	const handleCloseSnackbar = () => setSnackbar(null);

	const handleProcessRowUpdateError = useCallback((error) => {
		setSnackbar({ children: error.message, severity: 'error' });
	}, []);

	const CustomNoRowsOverlay = () => {
		return (
			<GridOverlay>
				<div>No hay turnos cargados</div>
			</GridOverlay>
		);
	};

	return (
		<div style={{ height: 400, width: '100%' }}>
			<DataGrid
				editMode="row"
				rows={rows}
				columns={columns}
				onProcessRowUpdateError={handleProcessRowUpdateError}
				columnVisibilityModel={{
					idPerro: false,
					nombre: !urlTurnos.toString().includes('perro'),
					estadoBotones: usuario.rol == 'veterinario',
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
				<Snackbar
					open
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					onClose={handleCloseSnackbar}
					autoHideDuration={6000}
				>
					<Alert {...snackbar} onClose={handleCloseSnackbar} />
				</Snackbar>
			)}
			<Dialog
				open={openAceptar}
				onClose={handleCloseAceptar}
				aria-labelledby="aceptar-title"
				aria-describedby="aceptar-description"
			>
				<DialogTitle id="aceptar-title">
					Estas seguro que deseas <b style={{ color: 'green' }}>aceptar</b> el
					turno?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="aceptar-description">
						Recuerda que no podrás deshacer esta acción
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color="success"
						variant="outlined"
						onClick={handleCloseAceptar}
					>
						Cancelar
					</Button>
					<Button
						variant="contained"
						color="success"
						onClick={handleConfirmarAceptar}
						autoFocus
					>
						Aceptar
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={openAsistio}
				onClose={handleCloseAsistio}
				aria-labelledby="asistio-title"
				aria-describedby="asistio-description"
			>
				<DialogTitle id="asistio-title">
					Estas seguro que deseas marcar que{' '}
					<b style={{ color: 'green' }}>asistio</b> al turno?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="asistio-description">
						Recuerda que no podrás deshacer esta acción
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color="success"
						variant="outlined"
						onClick={handleCloseAsistio}
					>
						Cancelar
					</Button>
					<Button
						variant="contained"
						color="success"
						onClick={handleConfirmarAsistio}
						autoFocus
					>
						Asistio
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={openRechazar}
				onClose={handleCloseRechazar}
				aria-labelledby="rechazar-title"
				aria-describedby="rechazar-description"
			>
				<DialogTitle id="rechazar-title">
					Estas seguro que deseas <b style={{ color: 'red' }}>rechazar</b> el
					turno?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="rechazar-description">
						Recuerda que no podrás deshacer esta acción
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color="error"
						variant="outlined"
						onClick={handleCloseRechazar}
					>
						Cancelar
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={handleConfirmarRechazar}
						autoFocus
					>
						Rechazar
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={openFalto}
				onClose={handleCloseFalto}
				aria-labelledby="falto-title"
				aria-describedby="falto-description"
			>
				<DialogTitle id="falto-title">
					Estas seguro que deseas marcar que{' '}
					<b style={{ color: 'red' }}>falto</b> al turno?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="falto-description">
						Recuerda que no podrás deshacer esta acción
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="error" variant="outlined" onClick={handleCloseFalto}>
						Cancelar
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={handleConfirmarFalto}
						autoFocus
					>
						Falto
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default TablaTurnos;
