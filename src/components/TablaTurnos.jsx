import { useEffect, useState, useCallback } from 'react';
import url from '../data/url';
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { GridOverlay } from '@mui/x-data-grid';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { CheckCircle, DoNotDisturbOn } from '@mui/icons-material';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';

function TablaTurnos() {
	const token = localStorage.getItem('jwt');

	const [rows, setRows] = useState([]);

	const [turno, setTurno] = useState(null);

	useEffect(() => {
		actualizarTabla();
	}, []);

	function actualizarTabla() {
		obtenerTurnos().then((rows) => setRows(rows));
	}

	function obtenerTurnos() {
		return fetch(url + 'turnos', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					if (response.status == 401) {
						setSnackbar({
							children: 'No estas autorizado para ver los turnos',
							severity: 'error',
						});
					}
					return [];
				}
			})
			.then((turnos) => {
				if (turnos.length == 0) {
					setSnackbar({
						children: 'La lista de turnos se encuentra vacia',
						severity: 'info',
					});
				}
				return turnos;
			})
			.catch((error) => {
				console.error('Error en el fetch: ' + error);

				setSnackbar({
					children: 'Error al conectar con la base de datos',
					severity: 'error',
				});
				return [];
			});
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
			field: 'fecha',
			headerName: 'Fecha',
			width: 100,
		},
		{
			field: 'motivo',
			headerName: 'Motivo',
			width: 180,
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
						{data.estado == 'Pendiente' && (
							<>
								<GridActionsCellItem
									icon={<CheckCircle />}
									key="confirmado"
									label="Confirmado"
									onClick={() => {
										let nuevoTurno = { ...data };
										nuevoTurno.estado = 'Confirmado';
										handleClickOpenConfirmar();
										setTurno(nuevoTurno);
									}}
									sx={{
										'&:hover': {
											color: 'green',
										},
									}}
								/>
								<GridActionsCellItem
									icon={<DoNotDisturbOn />}
									key="cancelado"
									label="Cancelado"
									onClick={() => {
										let nuevoTurno = { ...data };
										nuevoTurno.estado = 'Cancelado';
										handleClickOpenCancelar();
										setTurno(nuevoTurno);
									}}
									sx={{
										'&:hover': {
											color: 'red',
										},
									}}
								/>
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

	const handleConfirmarConfirmar = () => {
		handleCambiarEstado(turno);
		handleCloseConfirmar();
	};
	const handleConfirmarCancelar = () => {
		handleCambiarEstado(turno);
		handleCloseCancelar();
	};
	const [openConfirmar, setOpenConfirmar] = useState(false);
	const [openCancelar, setOpenCancelar] = useState(false);

	const handleClickOpenConfirmar = () => {
		setOpenConfirmar(true);
	};

	const handleCloseConfirmar = () => {
		setOpenConfirmar(false);
	};

	const handleClickOpenCancelar = () => {
		setOpenCancelar(true);
	};

	const handleCloseCancelar = () => {
		setOpenCancelar(false);
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
				open={openConfirmar}
				onClose={handleCloseConfirmar}
				aria-labelledby="confirmar-title"
				aria-describedby="confirmar-description"
			>
				<DialogTitle id="confirmar-title">
					Estas seguro que deseas <b style={{ color: 'green' }}>confirmar</b> el
					turno?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="confirmar-description">
						Recuerda que no podrás deshacer esta acción
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={handleCloseConfirmar}>
						No
					</Button>
					<Button
						variant="contained"
						onClick={handleConfirmarConfirmar}
						autoFocus
					>
						Si
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={openCancelar}
				onClose={handleCloseCancelar}
				aria-labelledby="cancelar-title"
				aria-describedby="cancelar-description"
			>
				<DialogTitle id="cancelar-title">
					Estas seguro que deseas <b style={{ color: 'red' }}>cancelar</b> el
					turno?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="cancelar-description">
						Recuerda que no podrás deshacer esta acción
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={handleCloseCancelar}>
						No
					</Button>
					<Button
						variant="contained"
						onClick={handleConfirmarCancelar}
						autoFocus
					>
						Si
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default TablaTurnos;
