import { NavLink } from 'react-router-dom';
import './navbar.css';

function Navbar() {
	return (
		<div>
			<ul>
				<li>
					<NavLink
						className={({ isActive }) => (isActive ? 'active' : '')}
						to="/"
					>
						Inicio
					</NavLink>
				</li>
				<li>
					<NavLink
						className={({ isActive }) => (isActive ? 'active' : '')}
						to="/login"
					>
						Iniciar sesion
					</NavLink>
				</li>
			</ul>
		</div>
	);
}

export default Navbar;
