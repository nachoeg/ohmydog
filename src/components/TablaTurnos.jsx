import { useEffect, useState, useCallback } from 'react';
import url from '../data/url';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Delete from '@mui/icons-material/DeleteForever';

const useFakeMutation = () => {
	return useCallback(
		(user) =>
			new Promise((resolve, reject) => {
				setTimeout(() => {
					if (user.name?.trim() === '') {
						reject(new Error("Error while saving user: name can't be empty."));
					} else {
						resolve({ ...user, name: user.name?.toUpperCase() });
					}
				}, 200);
			}),
		[]
	);
};

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
			.catch((error) => {
				console.error('Error en el fetch: ' + error);

				setSnackbar({
					children: 'Error al conectar con la base de datos',
					severity: 'error',
				});
				return [];
			});
	}

	const columns = [
	    {
    	    field: 'perro',
            headerName: 'Perro',
            width: 50
    	},
		{
		    field: 'fecha',
		    headerName: 'Fecha',
		    width: 50
		},
		{
			field: 'motivo',
			headerName: 'Motivo',
			editable: true,
			width: 170,
		},
		{
			field: 'estado',
			headerName: 'Estado',
			editable: true,
			width: 100,
		}
	];

	const mutateRow = useFakeMutation();

	const [snackbar, setSnackbar] = useState(null);

	const handleCloseSnackbar = () => setSnackbar(null);

	const handleProcessRowUpdateError = useCallback((error) => {
		setSnackbar({ children: error.message, severity: 'error' });
	}, []);

	return (
		<div style={{ height: 400, width: '55%' }}>
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
