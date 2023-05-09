import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import { NavLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';

function LoginButton() {
	return (
		<NavLink to="/login">
			<Button variant="contained" startIcon={<LoginIcon />}>
				<Typography sx={{ display: { xs: 'none', md: 'flex' } }}>
					Iniciar sesión
				</Typography>
			</Button>
		</NavLink>
	);
}

export default LoginButton;
