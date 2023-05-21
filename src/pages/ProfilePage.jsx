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
import { Close, Edit, Save } from '@mui/icons-material';
import url from '../data/url';

function ProfilePage() {
	const token = localStorage.getItem('jwt');

	const [usuario, setUsuario] = useState(
		JSON.parse(localStorage.getItem('usuario'))
	);

	const [localidad, setLocalidad] = useState('');
	const [direccion, setDireccion] = useState('');
	const [telefono, setTelefono] = useState('');
	const [email, setEmail] = useState('');

	useEffect(() => {
		setUsuario(JSON.parse(localStorage.getItem('usuario')));
	}, []);

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
		return (
			datos.get('email').trim() != '' &&
			toString(datos.get('telefono')).trim() != '' &&
			datos.get('localidad').trim() != '' &&
			datos.get('direccion').trim() != ''
		);
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		if (!validarDatos(data)) {
			setSnackbar({
				children: 'No puede ingresar un campo vacio',
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
			localStorage.setItem('usuario', JSON.stringify(user));

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
			<Card sx={{ padding: '10px', marginTop: 8 }}>
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
								label="Correo Eletrónico"
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
