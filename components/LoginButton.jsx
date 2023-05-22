import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import { NavLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';

function LoginButton() {
	return (
		<NavLink to="/login">
			<Button
				variant="contained"
				sx={{
					paddingBlock: { xs: '12px', md: '6px' },
					paddingInline: { xs: '12px', md: '16px' },
					minWidth: { xs: '36px' },
				}}
				startIcon={<LoginIcon sx={{ marginLeft: { xs: '4px', md: '0px' } }} />}
			>
				<Typography
					sx={{
						display: { xs: 'none', md: 'flex' },
					}}
				>
					Iniciar sesión
				</Typography>
			</Button>
		</NavLink>
	);
}

export default LoginButton;
