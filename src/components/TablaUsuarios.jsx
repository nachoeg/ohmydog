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

function TablaUsuarios() {
	const token = localStorage.getItem('jwt');
	const [rows, setRows] = useState([]);

	useEffect(() => {
		obtenerUsuarios().then((rows) => setRows(rows));
	}, []);

	function obtenerUsuarios() {
		return fetch(url + 'usuarios', {
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
							children: 'Error no esta autorizado para ver los usuarios',
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
		{ field: 'id', headerName: 'ID', width: 50 },
		{
			field: 'email',
			headerName: 'Email',
			editable: true,
			width: 170,
		},
		{
			field: 'password',
			headerName: 'Contraseña',
			editable: true,
			width: 100,
		},
		{ field: 'nombre', headerName: 'Nombre', editable: true, width: 100 },
		{ field: 'apellido', headerName: 'Apellido', editable: true, width: 100 },
		{
			field: 'telefono',
			headerName: 'Telefono',
			type: 'number',
			editable: true,
			width: 100,
		},
		{
			field: 'localidad',
			headerName: 'Localidad',
			editable: true,
			width: 100,
		},
		{
			field: 'dni',
			headerName: 'Dni',
			type: 'number',
			editable: true,
			width: 100,
		},
		{
			field: 'rol',
			headerName: 'Rol',
			editable: true,
			width: 100,
		},
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Eliminar',
			width: 100,
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
		},
	];

	const mutateRow = useFakeMutation();

	const [snackbar, setSnackbar] = useState(null);

	const handleCloseSnackbar = () => setSnackbar(null);

	const handleDeleteClick = (id) => async () => {
		const response = await fetch(url + 'usuarios/delete/' + id, {
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
				children: 'Usuario eliminado con exito',
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

	const processRowUpdate = useCallback(
		async (newRow, oldRow) => {
			// Make the HTTP request to save in the backend
			const responseFetch = await fetch(url + 'usuarios/modify/' + newRow.id, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					token: `${token}`,
				},
				body: JSON.stringify(newRow),
			});
			console.log(responseFetch);
			if (responseFetch.ok) {
				const response = await mutateRow(newRow);
				setSnackbar({
					children: 'Usuario guardado con exito',
					severity: 'success',
				});
				return response;
			}
			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
			return oldRow;
		},
		[mutateRow]
	);

	const handleProcessRowUpdateError = useCallback((error) => {
		setSnackbar({ children: error.message, severity: 'error' });
	}, []);

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

export default TablaUsuarios;
