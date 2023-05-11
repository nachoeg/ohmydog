import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Logotipo() {
	return (
		<Link
			href="/"
			underline="none"
			sx={{
				textDecoration: 'none',
				mr: { xs: 0, sm: 2 },
				display: 'flex',
				flexDirection: 'row',
			}}
		>
			<Avatar
				sx={{
					// display: { xs: 'none', md: 'block' },
					mr: { xs: 0, sm: 1 },
					alignSelf: 'center',
				}}
				alt="Oh My Dog! logo"
				src="/logo.png"
			/>
			<Box
				sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column' }}
			>
				<Typography
					variant="h5"
					noWrap
					sx={{
						fontWeight: 700,
						textAlign: 'center',
					}}
				>
					¡Oh my dog!
				</Typography>
				<Typography
					variant="subtitle2"
					noWrap
					sx={{
						textAlign: 'center',
						fontWeight: 500,
						letterSpacing: '.2rem',
					}}
				>
					VETERINARIA
				</Typography>
			</Box>
		</Link>
	);
}

export default Logotipo;
