import { useEffect, useState, useCallback } from 'react';
import url from '../data/url';
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { GridOverlay } from '@mui/x-data-grid';

function TablaTurnos() {
	const token = localStorage.getItem('jwt');
	const [rows, setRows] = useState([]);

	useEffect(() => {
		obtenerTurnos().then((rows) => setRows(rows));
	}, []);

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
			width: 100,
		},
		{
			field: 'fecha',
			headerName: 'Fecha',
			width: 150,
		},
		{
			field: 'motivo',
			headerName: 'Motivo',
			// editable: true,
			// type: 'singleSelect',
			// valueOptions: motivoTurnos,
			width: 150,
		},
		{
			field: 'estado',
			headerName: 'Estado',
			type: 'singleSelect',
			editable: true,
			valueOptions: [
				{ value: 'Pendiente', label: 'Pendiente' },
				{ value: 'Cancelado', label: 'Cancelado' },
				{ value: 'Confirmado', label: 'Confirmado' },
			],
			width: 150,
		},
	];

	const [snackbar, setSnackbar] = useState(null);

	const handleCloseSnackbar = () => setSnackbar(null);

	function validarDatos(datos) {
		return datos.estado.trim() != '';
	}

	const processRowUpdate = useCallback(async (newRow, oldRow) => {
		if (!validarDatos(newRow)) {
			setSnackbar({
				children: 'No puede ingresar un campo vacio',
				severity: 'error',
			});
			return oldRow;
		}
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

export default TablaTurnos;
