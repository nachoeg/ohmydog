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
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { pages, pagesAuth, settings } from '../data/pages';
import { useState } from 'react';
import { useEffect } from 'react';

function ResponsiveAppBar() {
	const [auth, setAuth] = useState(localStorage.getItem('jwt') != null);
	const [routes, setRoutes] = useState([]);
	const [anchorElNav, setAnchorElNav] = useState(null);
	const [anchorElUser, setAnchorElUser] = useState(null);

	// useEffect(() => {
	// 	if (localStorage.getItem('jwt') != null) {
	// 		setAuth(true);
	// 	} else {
	// 		setAuth(false);
	// 	}
	// 	//chequear si existe auth en el local storage
	// 	// y setear el estado auth si esta logueado o no
	// }, []);

	useEffect(() => {
		if (auth) setRoutes(pagesAuth);
		else setRoutes(pages);
	}, [auth]);

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
									<MenuItem
										onClick={() => {
											handleCloseUserMenu;
											localStorage.clear('jwt');
											location.replace('/');
										}}
									>
										<Typography>{'Cerrar Sesión'}</Typography>
									</MenuItem>
									{/* <LogoutButton
										onClick={() => {
											handleCloseUserMenu;
											localStorage.clear('jwt');
											location.replace('/');
										}}
									/> */}
								</Menu>
							</Box>
						) : (
							<LoginButton />
						)}
					</Toolbar>
				</Container>
			</AppBar>

			<Outlet />
		</>
	);
}
export default ResponsiveAppBar;
