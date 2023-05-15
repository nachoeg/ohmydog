import AddIcon from '@mui/icons-material/Add';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import url from '../data/url';
import { useEffect, useState } from 'react';

function UsersPage() {
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
					throw new Error('Error en la solicitud fetch');
				}
			})
			.then((data) => {
				// console.log(data);
				return data;
			})
			.catch((error) => {
				console.error('Error en el fetch: ' + error);
			});
	}
	const columns = [
		{ field: 'id', headerName: 'ID', width: 50 },
		{
			field: 'email',
			headerName: 'Email',
			width: 170,
			editable: true,
		},
		{
			field: 'password',
			headerName: 'Contraseña',
			width: 100,
		},
		{ field: 'nombre', headerName: 'Nombre', width: 100 },
		{ field: 'apellido', headerName: 'Apellido', width: 100 },
		{
			field: 'telefono',
			headerName: 'Telefono',
			type: 'number',
			width: 100,
		},
		{
			field: 'localidad',
			headerName: 'Localidad',
			width: 100,
		},
		{
			field: 'dni',
			headerName: 'Dni',
			type: 'number',
			width: 100,
		},
		{
			field: 'rol',
			headerName: 'Rol',
			width: 100,
		},
	];

	return (
		<Container
			component="main"
			maxWidth="lg"
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				mt: 8,
			}}
		>
			<div style={{ height: 400, width: '100%' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					initialState={{
						pagination: {
							paginationModel: { page: 0, pageSize: 5 },
						},
					}}
					pageSizeOptions={[5, 10]}
				/>
			</div>
			<NavLink to="/signup" style={{ textDecoration: 'none', width: '100%' }}>
				<Button
					startIcon={<AddIcon />}
					sx={{ mt: 2, width: '100%' }}
					variant="contained"
				>
					Crear Usuario
				</Button>
			</NavLink>
		</Container>
	);
}

export default UsersPage;
