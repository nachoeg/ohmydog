import {
	Card,
	List,
	Typography,
	Container,
	Avatar,
	ListItemAvatar,
	ListItemText,
	ListItem,
	Divider,
	ListItemIcon,
	Grid,
	TextField,
	Button,
	Snackbar,
	Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

import MapIcon from '@mui/icons-material/Map';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import { useEffect, useState } from 'react';
import { Close, Edit, Password, Save } from '@mui/icons-material';
import url from '../data/url';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; // Para obtener el parametro pasado por la url

function ProfilePage() {
	const token = localStorage.getItem('jwt');
	// Obtiene el id del usuario que se pasa como parametro en la url
	const location = useLocation();
	const idUsuario = location.pathname.split('/')[2];

	// Usuario del que se muestran los datos
	const [usuario, setUsuario] = useState(obtenerUsuario);

	// Usuario que tiene sesion activa, esto para chequear si es el "dueño del perfil"
	// y poder determinar si mostrar o no el cambiar la contraseña
	const usuarioSesion = JSON.parse(localStorage.getItem('usuario'));

	// Asigna al usuario el usuario obtenido de la BD.
	useEffect(() => {
		obtenerUsuario().then((usuario) => setUsuario(usuario));
		setEditar(false);
	}, [idUsuario]);

	// Obtiene el usuario de la BD mediante su ID.
	async function obtenerUsuario() {
		try {
			const response = await fetch(url + 'usuarios/' + idUsuario, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					token: `${token}`,
				},
			});
			if (!response.ok) {
				if (response.status == 401) {
					setSnackbar({
						children: 'No estas autorizado para ver el usuario',
						severity: 'error',
					});
				}
				return null;
			}
			let user = await response.json();
			if (user == null) {
				setSnackbar({
					children: 'No se encontro al usuario',
					severity: 'error',
				});
			}
			console.log(user);
			return user;
		} catch (error) {
			console.error('Error en el fetch: ' + error);

			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
			return null;
		}
	}

	const [localidad, setLocalidad] = useState('');
	const [direccion, setDireccion] = useState('');
	const [telefono, setTelefono] = useState('');
	const [email, setEmail] = useState('');

	useEffect(() => {
		setDireccion(usuario.direccion);
		setTelefono(usuario.telefono);
		setEmail(usuario.email);
		setLocalidad(usuario.localidad);
	}, [usuario]);

	if (usuario == null) {
		location.replace('/login');
	}
	const [editar, setEditar] = useState(false);
	const handleEditarClick = () => {
		setEditar(true);
	};

	function validarDatos(datos) {
		if (datos.get('email').toString().trim() == '') {
			setEmail(usuario.email);
			return false;
		}
		if (datos.get('direccion').trim() == '') {
			setDireccion(usuario.direccion);
			return false;
		}
		if (datos.get('telefono').trim() == '') {
			setTelefono(usuario.telefono);
			return false;
		}
		if (datos.get('localidad').trim() == '') {
			setLocalidad(usuario.localidad);
			return false;
		}
		return true;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		if (!validarDatos(data)) {
			setSnackbar({
				children: 'No puede ingresar un campo vacio.',
				severity: 'error',
			});
			return;
		}
		const user = {
			...usuario,
			email: data.get('email'),
			localidad: data.get('localidad'),
			direccion: data.get('direccion'),
			telefono: data.get('telefono'),
		};
		const response = await fetch(url + 'usuarios/modify/' + user.id, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
			body: JSON.stringify(user),
		});
		if (response.ok) {
			setUsuario(user);
			// Si el usuario que modifico, es el que tiene la sesion activa, se actualizan
			// los datos de la sesion.
			if (idUsuario == usuarioSesion.id) {
				localStorage.setItem('usuario', JSON.stringify(user));
			}

			setSnackbar({
				children: 'Modificación realizada con éxito',
				severity: 'success',
			});
			setEditar(false);
			return;
		}
		if (response.status == 400) {
			setSnackbar({
				children: 'Dato invalido',
				severity: 'error',
			});
			return;
		}
		if (response.status == 403) {
			setSnackbar({
				children: 'El email ingresado ya está en uso',
				severity: 'error',
			});
			setEmail(usuario.email);
			return;
		}
		setSnackbar({
			children: 'Error al conectar con la base de datos',
			severity: 'error',
		});
	};

	const handleCancelarClick = () => {
		setLocalidad(usuario.localidad);
		setEmail(usuario.email);
		setTelefono(usuario.telefono);
		setDireccion(usuario.direccion);
		setEditar(false);
	};

	const EditarBoton = () => (
		<Button
			startIcon={<Edit />}
			fullWidth
			variant="contained"
			onClick={handleEditarClick}
		>
			Editar
		</Button>
	);
	const GuardarBoton = () => (
		<Button
			startIcon={<Save />}
			fullWidth
			color={'success'}
			variant="contained"
			type="submit"
		>
			Guardar
		</Button>
	);
	const CancelarBoton = () => (
		<Button
			startIcon={<Close />}
			fullWidth
			color={'error'}
			variant="contained"
			onClick={handleCancelarClick}
		>
			Cancelar
		</Button>
	);
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);
	return (
		<Container component="main" maxWidth="sm">
			<Card sx={{ padding: '10px', marginTop: 4 }}>
				<List component="form" onSubmit={handleSubmit}>
					<ListItem>
						<ListItemAvatar>
							<Avatar alt="Foto de perfil" />
						</ListItemAvatar>
						<ListItemText
							primary={
								<Typography variant="h5">
									{usuario.nombre + ' ' + usuario.apellido}
								</Typography>
							}
							secondary={'DNI: ' + usuario.dni}
						/>
					</ListItem>
					<Divider />
					<ListItem>
						<ListItemIcon sx={{ mr: '20px', minWidth: 0 }}>
							<EmailIcon />
						</ListItemIcon>
						<ListItemText>
							<TextField
								label="Correo Electrónico"
								InputProps={{
									readOnly: !editar,
								}}
								required
								fullWidth
								name="email"
								id="email"
								value={email}
								onChange={(event) => {
									setEmail(event.target.value);
								}}
								variant="outlined"
								size="small"
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemIcon sx={{ mr: '20px', minWidth: 0 }}>
							<PhoneIcon />
						</ListItemIcon>
						<ListItemText>
							<TextField
								label="Telefono"
								required
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								type="number"
								id="telefono"
								name="telefono"
								value={telefono}
								onChange={(event) => {
									setTelefono(event.target.value);
								}}
								variant="outlined"
								size="small"
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemIcon sx={{ mr: '20px', minWidth: 0 }}>
							<MapIcon />
						</ListItemIcon>
						<ListItemText>
							<TextField
								label="Localidad"
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								required
								name="localidad"
								id="localidad"
								value={localidad}
								onChange={(event) => {
									setLocalidad(event.target.value);
								}}
								variant="outlined"
								size="small"
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemIcon sx={{ mr: '20px', minWidth: 0 }}>
							<MapsHomeWorkIcon />
						</ListItemIcon>
						<ListItemText>
							<TextField
								label="Direccion"
								InputProps={{
									readOnly: !editar,
								}}
								required
								name="direccion"
								fullWidth
								id="direccion"
								value={direccion}
								onChange={(event) => {
									setDireccion(event.target.value);
								}}
								variant="outlined"
								size="small"
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						{!editar ? (
							<EditarBoton />
						) : (
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<GuardarBoton />
								</Grid>
								<Grid item xs={12} sm={6}>
									<CancelarBoton />
								</Grid>
							</Grid>
						)}
					</ListItem>
					<ListItem>
						{idUsuario == usuarioSesion.id ? (
							<NavLink style={{ width: '100%' }} to={'/cambiar-contraseña'}>
								<Button
									startIcon={<Password />}
									fullWidth
									variant="contained"
									color="tertiary"
								>
									Cambiar contraseña
								</Button>
							</NavLink>
						) : null}
					</ListItem>
				</List>
			</Card>
			{!!snackbar && (
				<Snackbar
					open
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					onClose={handleCloseSnackbar}
					autoHideDuration={6000}
				>
					<Alert {...snackbar} onClose={handleCloseSnackbar} />
				</Snackbar>
			)}
		</Container>
	);
}
export default ProfilePage;
