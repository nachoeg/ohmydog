import { useEffect, useState, useCallback } from 'react';
import url from '../data/url';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Delete from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

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
							children: 'No estas autorizado para ver los usuarios',
							severity: 'error',
						});
					}
					return [];
				}
			})
			.then((usuarios) => {
				if (usuarios.length == 0) {
					setSnackbar({
						children: 'La lista de usuarios clientes se encuentra vacia',
						severity: 'info',
					});
				}
				return usuarios;
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
		{ field: 'id', headerName: 'ID', width: 70, id: 'id' },
		{
			field: 'email',
			headerName: 'Email',
			editable: true,
			width: 170,
		},
		{ field: 'nombre', headerName: 'Nombre', width: 100 },
		{ field: 'apellido', headerName: 'Apellido', width: 100 },
		{
			field: 'dni',
			headerName: 'DNI',
			type: 'number',
			width: 100,
		},
		{
			field: 'telefono',
			headerName: 'Telefono',
			type: 'number',
			editable: true,
			width: 100,
		},
		{
			field: 'direccion',
			headerName: 'Direccion',
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
			field: 'actions',
			headerName: '',
			width: 200,
			renderCell: (params) => {
				const { id } = params.row;
				return (
					<>
						<NavLink to={`/perrosusuario/${id}`}  style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
							<Button style={{
								border: 'none',
								background: 'none',
								fontSize: '0.8em',
							}}>
								Ver perros
							</Button>
						</NavLink>
						<GridActionsCellItem
							icon={<Delete />}
							key="delete"
							label="Delete"
							onClick={handleDeleteClick(id)}
							color="inherit"
						/>
					</>
				);
			},
		},
	];

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

	function validarDatos(datos) {
		return (
			datos.email.trim() != '' &&
			toString(datos.telefono).trim() != '' &&
			datos.localidad.trim() != '' &&
			datos.direccion.trim() != ''
		);
	}

	const processRowUpdate = useCallback(async (newRow, oldRow) => {
		if (!validarDatos(newRow)) {
			setSnackbar({
				children: 'No puede ingresar un campo vacio',
				severity: 'error',
			});
			return oldRow;
		}
		const response = await fetch(url + 'usuarios/modify/' + newRow.id, {
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
				children: 'Usuario guardado con exito',
				severity: 'success',
			});
			return newRow;
		}
		if (response.status == 403) {
			setSnackbar({
				children: 'El email ingresado ya está en uso',
				severity: 'error',
			});
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
