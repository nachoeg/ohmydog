import { Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
function HomePage() {
	return (
		<Grid
			container
			sx={{
				justifyContent: 'center',
				alignContent: 'center',
				mt: { xs: 1, sm: 3 },
			}}
			spacing={2}
		>
			<Grid
				item
				xs={12}
				sm={5}
				md={6}
				lg={4}
				sx={{
					display: 'flex',
					// justifyContent: 'end',
					flexDirection: 'column',
					mx: 2,
					gap: 1,
				}}
			>
				<Typography
					component="h1"
					variant="h3"
					sx={{
						// textAlign: { xs: 'center', sm: 'end' },
						mt: { xs: 0, sm: 2 },
					}}
				>
					Un hogar para la{' '}
					<Typography
						component="span"
						variant="h3"
						sx={{
							fontWeight: 'bold',
							bgcolor: 'secondary.main',
							color: 'white',
						}}
					>
						salud
					</Typography>{' '}
					y el{' '}
					<Typography
						component="span"
						variant="h3"
						sx={{
							fontWeight: 'bold',
							bgcolor: 'secondary.main',
							color: 'white',
						}}
					>
						bienestar
					</Typography>{' '}
					de tus mascotas
				</Typography>
				<Typography
					component="h1"
					variant="subtitle1"
					sx={
						{
							// textAlign: { xs: 'center', sm: 'end' },
						}
					}
				>
					Expertos dedicados a mantener a tus compañeros peludos saludables y
					felices
				</Typography>
				<NavLink to="/" style={{ textDecoration: 'none' }}>
					<Button variant="outlined" sx={{ flexGrow: '0' }}>
						Conoce más
					</Button>
				</NavLink>
			</Grid>
			<Grid
				item
				xs={12}
				sm={5}
				md={4}
				lg={6}
				xl={4}
				sx={{
					display: { xs: 'none', sm: 'flex' },
					justifyContent: { xs: 'center' },
				}}
			>
				<img
					style={{
						maxHeight: '70vh',
						maxWidth: '70vw',
					}}
					src="/hero.svg"
					alt="Foto de veterinario"
				/>
			</Grid>
		</Grid>
	);
}

export default HomePage;
