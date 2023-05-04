import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Outlet, NavLink } from 'react-router-dom';
import Logotipo from './Logotipo';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

const pages = [
	{ nombre: 'Turno', url: '/turnos' },
	{ nombre: 'Adopcion', url: '/adopcion' },
	{ nombre: 'Perdidos', url: '/perdidos' },
	{ nombre: 'Campañas', url: '/campañas' },
	{ nombre: 'Cruza', url: '/cruza' },
	{ nombre: 'Usuarios', url: '/usuarios' },
	{ nombre: 'Servicios externos', url: '/servicios' },
];
const settings = [
	{ nombre: 'Perfil', url: '/perfil' },
	{ nombre: 'Mis perros', url: '/misperros' },
	{ nombre: 'Registrar usuario', url: '/signup' },
	{ nombre: 'Iniciar sesión', url: '/login' },
	{ nombre: 'Cerrar sesión', url: '/logout' },
];

function ResponsiveAppBar() {
	const [auth, setAuth] = React.useState(true);
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const handleChange = (event) => {
		setAuth(event.target.checked);
	};

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<>
			<AppBar sx={{ backgroundColor: 'white' }} position="static">
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						{/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}

						<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
							<Logotipo />
						</Box>
						<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit"
							>
								<MenuIcon sx={{ color: 'primary.main' }} />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'left',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'left',
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: 'block', md: 'none' },
								}}
							>
								{pages.map((page) => (
									<NavLink
										key={page.nombre}
										to={page.url}
										style={{ textDecoration: 'none', color: '#000' }}
									>
										<MenuItem onClick={handleCloseNavMenu}>
											<Typography textAlign="center">{page.nombre}</Typography>
										</MenuItem>
									</NavLink>
								))}
							</Menu>
						</Box>
						<Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
							<Logotipo />
						</Box>
						<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
							{pages.map((page) => (
								<NavLink
									to={page.url}
									key={page.nombre}
									style={{ textDecoration: 'none' }}
								>
									<Button
										onClick={handleCloseNavMenu}
										sx={{ my: 2, display: 'block' }}
									>
										{page.nombre}
									</Button>
								</NavLink>
							))}
						</Box>
						{auth && (
							<Box sx={{ flexGrow: 0 }}>
								<Tooltip title="Abrir preferencias">
									<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
										<Avatar alt="Foto perfil" src="" />
									</IconButton>
								</Tooltip>
								<Menu
									sx={{ mt: '45px' }}
									id="menu-appbar"
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
									{settings.map((setting) => (
										<NavLink
											key={setting.nombre}
											to={setting.url}
											style={{
												textDecoration: 'none',
												color: '#000',
											}}
										>
											<MenuItem onClick={handleCloseUserMenu}>
												<Typography>{setting.nombre}</Typography>
											</MenuItem>
										</NavLink>
									))}
								</Menu>
							</Box>
						)}
						<FormGroup>
							<FormControlLabel
								control={
									<Switch
										checked={auth}
										onChange={handleChange}
										aria-label="login switch"
									/>
								}
								label={auth ? 'Logout' : 'Login'}
							/>
						</FormGroup>
					</Toolbar>
				</Container>
			</AppBar>

			<Outlet />
		</>
	);
}
export default ResponsiveAppBar;
