import { Box, Button, Container } from '@mui/material';
import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function Turns() {
	const navigate = useNavigate();
	useEffect(() => {
		console.log('hola');
		navigate('/turnos/todos');
	}, []);
	return (
		<>
			<Container
				component="main"
				maxWidth="sm"
				sx={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					mt: 4,
				}}
			>
				<Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
					<NavLink to={'/turnos/todos'} key={'todos'}>
						{({ isActive }) => (
							<Button variant={isActive ? 'contained' : 'outlined'}>
								Todos
							</Button>
						)}
					</NavLink>
					<NavLink to={'/turnos/hoy'} key={'hoy'}>
						{({ isActive }) => (
							<Button variant={isActive ? 'contained' : 'outlined'}>Hoy</Button>
						)}
					</NavLink>
					<NavLink to={'/turnos/asistidos'} key={'asistidos'}>
						{({ isActive }) => (
							<Button variant={isActive ? 'contained' : 'outlined'}>
								Asistidos
							</Button>
						)}
					</NavLink>
					<NavLink to={'/turnos/no-asistidos'} key={'no-asistidos'}>
						{({ isActive }) => (
							<Button variant={isActive ? 'contained' : 'outlined'}>
								No asistidos
							</Button>
						)}
					</NavLink>
				</Box>
				<Outlet />
			</Container>
		</>
	);
}

export default Turns;
