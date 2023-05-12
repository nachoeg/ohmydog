import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
function UsersPage() {
	return (
		<NavLink to="/signup" style={{ textDecoration: 'none' }}>
			<Button>Crear Usuario </Button>
		</NavLink>
	);
}

export default UsersPage;
