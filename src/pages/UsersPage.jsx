import AddIcon from '@mui/icons-material/Add';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import url from '../data/url';

function UsersPage() {
	const token = localStorage.getItem('jwt');
	fetch(url + 'usuarios', {
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
			console.log(data);
		})
		.catch((error) => {
			console.error('Error en el fetch: ' + error);
		});

	const columns = [
		{ field: 'id', headerName: 'ID', width: 70 },
		{ field: 'firstName', headerName: 'First name', width: 130 },
		{ field: 'lastName', headerName: 'Last name', width: 130 },
		{
			field: 'age',
			headerName: 'Age',
			type: 'number',
			width: 90,
		},
		{
			field: 'fullName',
			headerName: 'Full name',
			description: 'This column has a value getter and is not sortable.',
			sortable: false,
			width: 160,
			valueGetter: (params) =>
				`${params.row.firstName || ''} ${params.row.lastName || ''}`,
		},
	];

	const rows = [
		{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
		{ id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
		{ id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
		{ id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
		{ id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
		{ id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
		{ id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
		{ id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
		{ id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
	];

	return (
		<Container
			component="main"
			maxWidth="md"
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<div style={{ height: 400, width: '100%', marginTop: '20px' }}>
				<DataGrid
					rows={rows}
					columns={columns}
					initialState={{
						pagination: {
							paginationModel: { page: 0, pageSize: 5 },
						},
					}}
					pageSizeOptions={[5, 10]}
					checkboxSelection
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
