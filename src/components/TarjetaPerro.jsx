import {
	CalendarMonth,
	Cancel,
	Check,
	Delete,
	Edit,
	Email,
	Image,
	Map,
	Pets,
	Save,
	Verified,
} from '@mui/icons-material';
import {
	Alert,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import url from '../data/url';
import { Context } from '../context/Context';

function TarjetaPerro({ datos }) {
	const [editar, setEditar] = useState(false);
	const [email, setEmail] = useState(datos.email);
	const [nombre, setNombre] = useState(datos.nombre);
	const [zona, setZona] = useState(datos.zona);
	const [fecha, setFecha] = useState(datos.fecha);
	const [estado, setEstado] = useState(datos.estado);
	const [image, setImage] = useState(datos.imagen);
	const [selectedImage, setSelectedImage] = useState(null);
	const [snackbar, setSnackbar] = useState(null);
	const token = localStorage.getItem('jwt');
	const handleCloseSnackbar = () => setSnackbar(null);
	const { usuario } = useContext(Context);
	const [visible, setVisible] = useState(true);

	const handleEditarClick = () => {
		setEditar(true);
	};

	const handleCancelarClick = () => {
		resetearDatos();
	};

	const handleBorrarClick = async () => {
		const response = await fetch(url + 'perdidos/delete/' + datos.id, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (response.ok) {
			setSnackbar({
				children: 'Se elimino con éxito',
				severity: 'success',
			});
			setVisible(false);
			return;
		}
		if (response.status == 400) {
			setSnackbar({
				children: 'No se encontro al perro',
				severity: 'error',
			});
			return;
		}
		setSnackbar({
			children: 'Error al conectar con la base de datos',
			severity: 'error',
		});
	};

	const handleEncontradoClick = () => {
		setEstado('Encontrado');
	};

	function resetearDatos() {
		setEditar(false);
		setEmail(datos.email);
		setZona(datos.zona);
		setFecha(datos.fecha);
		setNombre(datos.nombre);
		setImage(datos.imagen);
	}

	function validarDatos(data) {
		let mensaje = 'No se puede enviar un campo vacio';
		if (data.get('email').toString().trim() == '') {
			setEmail(datos.email);
			return { resultado: false, mensaje };
		}
		if (data.get('zona').trim() == '') {
			setZona(datos.zona);
			return { resultado: false, mensaje };
		}
		if (data.get('fecha').trim() == '') {
			setFecha(datos.fecha);
			return { resultado: false, mensaje };
		}
		if (data.get('nombre').trim() == '') {
			setNombre(datos.nombre);
			return { resultado: false, mensaje };
		}
		//validar imagen
		let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png'];
		if (
			selectedImage != null &&
			allowedExtension.indexOf(selectedImage.type) <= -1
		) {
			setImage(datos.imagen);
			setSelectedImage(null);
			mensaje = 'El tipo de archivo soportado para la foto es jpg, jpeg o png.';
			return { resultado: false, mensaje };
		}
		return { resultado: true };
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const datosValidados = validarDatos(data);
		if (!datosValidados.resultado) {
			setSnackbar({
				children: datosValidados.mensaje,
				severity: 'error',
			});
			return;
		}
		const perro = {
			nombre: data.get('nombre'),
			zona: data.get('zona'),
			fecha: data.get('fecha'),
			email: data.get('email'),
			imagen: selectedImage ? selectedImage : datos.imagen,
		};

		const response = await fetch(url + 'perdidos/modify/' + datos.id, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
			body: JSON.stringify(perro),
		});

		if (response.ok) {
			setSnackbar({
				children: 'Modificación realizada con éxito',
				severity: 'success',
			});
			setEditar(false);
			return;
		}
		//se resetean los datos
		resetearDatos();

		if (response.status == 400) {
			setSnackbar({
				children: 'Datos invalidos',
				severity: 'error',
			});
			return;
		}
		setSnackbar({
			children: 'Error al conectar con la base de datos',
			severity: 'error',
		});
	};
	return (
		<>
			<Card
				sx={{
					display: visible ? 'flex' : 'none',
					flexDirection: { xs: 'column', sm: 'row' },
				}}
				component="form"
				onSubmit={handleSubmit}
			>
				<CardMedia
					sx={{
						height: 300,
						width: 300,
						flexShrink: 0,
						flexGrow: 1,
						alignSelf: 'center',
						m: 1,
						borderRadius: 1,
						boxShadow: 4,
					}}
					image={image}
					title={`Foto de ${datos.nombre}`}
				/>
				<CardContent
					sx={{
						p: 0,
						'&:last-child': {
							p: 0,
						},
					}}
				>
					{/* <Typography gutterBottom variant="h5" component="div">
						{datos.nombre}
					</Typography> */}
					{/* <Divider sx={{ mb: 1 }} /> */}

					<List sx={{ minWidth: 250, p: 0 }}>
						{estado == 'Encontrado' && (
							<ListItem sx={{ gap: 2 }}>
								<ListItemIcon sx={{ minWidth: 0, color: 'primary.main' }}>
									<Verified />
								</ListItemIcon>
								<ListItemText>
									<Typography
										variant="h6"
										sx={{ fontWeight: 'bold', color: 'primary.main' }}
									>
										Encontrado
									</Typography>
								</ListItemText>
							</ListItem>
						)}
						<ListItem sx={{ gap: 2 }}>
							<ListItemIcon sx={{ minWidth: 0 }}>
								<Pets />
							</ListItemIcon>
							<ListItemText>
								<TextField
									label="Nombre"
									InputProps={{
										readOnly: !editar,
									}}
									required
									fullWidth
									name="nombre"
									id="nombre"
									value={nombre}
									onChange={(event) => {
										setNombre(event.target.value);
									}}
									variant="outlined"
									size="small"
								/>
							</ListItemText>
						</ListItem>
						<ListItem sx={{ gap: 2 }}>
							<ListItemIcon sx={{ minWidth: 0 }}>
								<Email />
							</ListItemIcon>
							<ListItemText>
								<TextField
									label="Contacto"
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
						<ListItem sx={{ gap: 2 }}>
							<ListItemIcon sx={{ minWidth: 0 }}>
								<CalendarMonth />
							</ListItemIcon>
							<ListItemText>
								<TextField
									label="Fecha"
									InputProps={{
										readOnly: !editar,
									}}
									required
									fullWidth
									name="fecha"
									id="fecha"
									type="date"
									value={fecha}
									onChange={(event) => {
										setFecha(event.target.value);
									}}
									variant="outlined"
									size="small"
								/>
							</ListItemText>
						</ListItem>
						<ListItem sx={{ gap: 2 }}>
							<ListItemIcon sx={{ minWidth: 0 }}>
								<Map />
							</ListItemIcon>
							<ListItemText>
								<TextField
									label="Zona"
									InputProps={{
										readOnly: !editar,
									}}
									required
									fullWidth
									name="zona"
									id="zona"
									value={zona}
									onChange={(event) => {
										setZona(event.target.value);
									}}
									variant="outlined"
									size="small"
								/>
							</ListItemText>
						</ListItem>
					</List>
					{usuario &&
						(datos.idUsuario == usuario.id || usuario.rol == 'veterinario') &&
						estado != 'Encontrado' && (
							<CardActions
								sx={{
									display: 'flex',
									flexDirection: 'column',
									py: 0,
								}}
							>
								{!editar ? (
									<>
										<Grid container spacing={1}>
											<Grid item xs={12} sm={6}>
												<Button
													size="small"
													startIcon={<Edit />}
													onClick={handleEditarClick}
													fullWidth
													variant="contained"
												>
													Editar
												</Button>
											</Grid>
											<Grid item xs={12} sm={6}>
												<Button
													size="small"
													startIcon={<Delete />}
													onClick={handleBorrarClick}
													fullWidth
													color="error"
													variant="contained"
												>
													Borrar
												</Button>
											</Grid>
										</Grid>

										<Button
											size="small"
											startIcon={<Check />}
											sx={{ margin: 1 }}
											onClick={handleEncontradoClick}
											fullWidth
											color="success"
											variant="contained"
										>
											Encontrado
										</Button>
									</>
								) : (
									<>
										{/* <Button
										size="small"
										startIcon={<Image />}
										// onClick={handleEditarClick}
										component
										fullWidth
										variant="contained"
										color={'tertiary'}
									>
										Foto
									</Button> */}

										<Grid container spacing={1}>
											<Grid item xs={12} sm={6}>
												<Button
													size="small"
													startIcon={<Cancel />}
													fullWidth
													color="error"
													variant="contained"
													onClick={handleCancelarClick}
												>
													Cancelar
												</Button>
											</Grid>
											<Grid item xs={12} sm={6}>
												<Button
													size="small"
													startIcon={<Save />}
													fullWidth
													color={'success'}
													variant="contained"
													type="submit"
												>
													Guardar
												</Button>
											</Grid>
										</Grid>
										<Button
											fullWidth
											color={'tertiary'}
											variant="contained"
											size="small"
											sx={{ margin: 1 }}
											startIcon={<Image />}
											component="label"
										>
											Subir foto
											<input
												type="file"
												hidden
												name="fotoPerro"
												onChange={(event) => {
													setImage(URL.createObjectURL(event.target.files[0]));
													setSelectedImage(event.target.files[0]);
												}}
											/>
										</Button>
									</>
								)}
							</CardActions>
						)}
				</CardContent>
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
		</>
	);
}

export default TarjetaPerro;
