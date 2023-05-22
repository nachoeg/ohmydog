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
import LoginButton from './LoginButton';
import { pages, pagesLoggedUsers, pagesAdminUsers } from '../data/pages';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import AccountIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PetsIcon from '@mui/icons-material/Pets';
import url from '../data/url';
import { Context } from '../context/Context';
import Copyright from './Copyright';

function ResponsiveAppBar() {
	const [routes, setRoutes] = useState([]);
	const [anchorElNav, setAnchorElNav] = useState(null);
	const [anchorElUser, setAnchorElUser] = useState(null);
	const { auth, usuario } = useContext(Context);

	useEffect(() => {
		if (auth) {
			if (usuario.rol == 'veterinario') {
				setRoutes(pagesAdminUsers);
			} else {
				setRoutes(pagesLoggedUsers);
			}
		} else setRoutes(pages);
	}, [auth]);

	const handleLogout = () => {
		fetch(url + 'auth/logout', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				token: localStorage.getItem('jwt'),
			},
			credentials: 'include',
		})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.error('Error en el fetch: ' + error);
			})
			.finally(() => {
				localStorage.clear('jwt');
				localStorage.clear('usuarios');
				location.replace('/login');
			});
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
								{routes.map((page) => (
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
							{routes.map((page) => (
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
						{auth ? (
							<Box sx={{ flexGrow: 0 }}>
								<Tooltip title={usuario.nombre + ' ' + usuario.apellido}>
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
									<NavLink
										key={'Perfil'}
										to={'/perfil'}
										style={{
											textDecoration: 'none',
											color: '#000',
										}}
									>
										<MenuItem onClick={handleCloseUserMenu}>
											<AccountIcon sx={{ mr: '4px' }} />
											<Typography>Perfil</Typography>
										</MenuItem>
									</NavLink>
									{usuario.rol == 'cliente' && (
										<NavLink
											key={'Mis perros'}
											to={'/misperros'}
											style={{
												textDecoration: 'none',
												color: '#000',
											}}
										>
											<MenuItem onClick={handleCloseUserMenu}>
												<PetsIcon sx={{ mr: '4px' }} />
												<Typography>Mis perros</Typography>
											</MenuItem>
										</NavLink>
									)}
									<MenuItem
										onClick={() => {
											handleCloseUserMenu();
											handleLogout();
										}}
									>
										<LogoutIcon sx={{ mr: '4px' }} />
										<Typography>{'Cerrar Sesión'}</Typography>
									</MenuItem>
								</Menu>
							</Box>
						) : (
							<LoginButton />
						)}
					</Toolbar>
				</Container>
			</AppBar>

			<Outlet />
			<Copyright sx={{ mt: 5 }} />
		</>
	);
}
export default ResponsiveAppBar;
