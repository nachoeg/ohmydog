import { Avatar, Box, Chip, Container, IconButton } from '@mui/material';
import TablaTurnos from '../components/TablaTurnos';
import { NavLink, useLocation } from 'react-router-dom';
import { CalendarMonth, Cancel } from '@mui/icons-material';

function DogsUsersTurnsPage() {
	const location = useLocation();
	const url =
		location.pathname.split('/')[2] + '/' + location.pathname.split('/')[3];
	const nombre = location.pathname.split('/')[4].replaceAll('-', ' ');

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
				<Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
					<Chip
						avatar={
							<Avatar sx={{ p: 2 }}>
								<CalendarMonth />
							</Avatar>
						}
						variant="outlined"
						label={'Turnos de ' + nombre}
						sx={{
							fontSize: 20,
							// fontWeight: 'bold',
							py: 2.5,
							px: 0,
							borderRadius: 100,
						}}
					/>
					<NavLink to={'/turnos'}>
						<IconButton aria-label="cancelar">
							<Cancel />
						</IconButton>
					</NavLink>
				</Box>
				<TablaTurnos urlTurnos={url} />
			</Container>
		</>
	);
}

export default DogsUsersTurnsPage;
