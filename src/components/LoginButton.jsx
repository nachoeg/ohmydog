import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import { NavLink } from 'react-router-dom';

function LoginButton() {
	return (
		<NavLink to="/login">
			<Button variant="contained" startIcon={<LoginIcon />}>
				Iniciar sesión
			</Button>
		</NavLink>
	);
}

export default LoginButton;
