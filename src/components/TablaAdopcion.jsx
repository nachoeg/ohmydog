import { Alert, Snackbar } from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { razas } from '../data/perros';

function TablaAdopcion() {
	const [rows, setRows] = useState([]);

	// useEffect(() => {
	// 	obtenerPerros().then((rows) => setRows(rows));
	// }, []);

	// async function obtenerPerros() {
	// 	try {
	// 		const response = await fetch(url + 'perros/' + props.idUsuario, {
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

export default TablaAdopcion;
