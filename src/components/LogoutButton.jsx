import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

function Logout() {
	return (
		<Button
			sx={{ marginInline: '8px', marginTop: '10px' }}
			variant="contained"
			startIcon={<LogoutIcon />}
		>
			Cerrar sesión
		</Button>
	);
}

export default Logout;
