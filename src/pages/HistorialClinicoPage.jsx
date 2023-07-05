import {
	Card,
	List,
	Typography,
	Container,
	ListItemText,
	ListItem,
	Divider,
	TextField,
	Button,
	Snackbar,
	Alert,
	Grid,
} from '@mui/material';
import { Close, Edit, Save } from '@mui/icons-material';
import { useLocation } from 'react-router-dom'; // Para obtener el parametro pasado por la url
import { useEffect, useState } from 'react';
import url from '../data/url';
import MenuItem from '@mui/material/MenuItem';

// La pagina del historial clinico recibe el ID del perro, y muestra las enfermedades (si tuviera)
// las fechas de las vacunas (si las tuviera) y si esta castrado o no.
// Permitiendo modificar los datos que se muestran mediante un boton de editar.
// Ademas muestra el nombre del perro y del dueño en la cabecera de la pagina a modo de orientacion.

function HistorialClinicoPage() {
	// Obtiene el id del perro que se pasa como parametro en la url
	const location = useLocation();
	const idPerro = location.pathname.split('/')[2];
	const token = localStorage.getItem('jwt'); // Token de la sesion activa

	// Perro del que se muestran los datos
	const [perro, setPerro] = useState(obtenerPerro);

	// Asigna el perro a mostrar obteniendolo de la BD.
	useEffect(() => {
		obtenerPerro().then((perro) => setPerro(perro));
	}, [idPerro]);

	// Obtiene el perro de la BD mediante su ID.
	async function obtenerPerro() {
		try {
			const response = await fetch(url + 'perros/perroPorId/' + idPerro, {
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
						children: 'No estas autorizado para ver el perro',
						severity: 'error',
					});
				}
				return null;
			}
			let dog = await response.json();
			if (dog == null) {
				setSnackbar({
					children: 'No se encontro al perro',
					severity: 'error',
				});
			}
			console.log(dog);
			return dog;
		} catch (error) {
			console.error('Error en el fetch: ' + error);

			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
			return null;
		}
	}

	// Los atributos a mostrar que son modificables
	const [enfermedad, setEnfermedad] = useState('');
	const [antirrabica, setAntirrabica] = useState('');
	const [antienfermedades, setAntienfermedades] = useState('');
	const [castrado, setCastrado] = useState('');

	// Si cambia el perro, se deben actualizar los datos
	useEffect(() => {
		setEnfermedad(perro.enfermedad);
		setAntirrabica(perro.vacunaAntirrabica);
		setAntienfermedades(perro.vacunaAntienfermedades);
		setCastrado(perro.castrado);
	}, [perro]);

	// Variable para activar funciones de edicion
	const [editar, setEditar] = useState(false);
	const handleEditarClick = () => {
		setEditar(true);
	};

	// Manejador del submit (guardar modificacion)
	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const dog = {
			...perro,
			enfermedad: data.get('enfermedad'),
			castrado: data.get('castrado'),
			vacunaAntienfermedades: data.get('antienfermedades'),
			vacunaAntirrabica: data.get('antirrabica'),
		};
		const response = await fetch(url + 'perros/modify/' + idPerro, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
			body: JSON.stringify(dog),
		});
		if (response.ok) {
			setPerro(dog);
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
		setSnackbar({
			children: 'Error al conectar con la base de datos',
			severity: 'error',
		});
	};

	// Manejador del boton de cancelar
	const handleCancelarClick = () => {
		setEnfermedad(perro.enfermedad);
		setAntirrabica(perro.antirrabica);
		setAntienfermedades(perro.antienfermedades);
		setCastrado(perro.castrado);
		setEditar(false);
	};

	// Botones de editar, guardar y cancelar
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

	// Declaracion de snackbar para mostrar mensajes.
	const [snackbar, setSnackbar] = useState(null);
	const handleCloseSnackbar = () => setSnackbar(null);

	return (
		<Container component="main" maxWidth="sm">
			<Card sx={{ padding: '10px', marginTop: 4 }}>
				<List component="form" onSubmit={handleSubmit}>
					<ListItem>
						<ListItemText
							primary={
								<Typography variant="h5">
									Historial clínico de {perro.nombre}
								</Typography>
							}
						/>
					</ListItem>
					<Divider />
					<ListItem>
						<ListItemText>
							<Typography variant="h7" sx={{ mr: '20px' }}>
								Enfermedades
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								fullWidth
								name="enfermedad"
								id="enfermedad"
								value={enfermedad}
								variant="outlined"
								size="small"
								onChange={(event) => {
									setEnfermedad(event.target.value);
								}}
							/>
						</ListItemText>
					</ListItem>
					<ListItem>
						<Grid container spacing={2} alignItems="center">
							<Grid item xs={6}>
								<ListItemText>
									<Typography variant="h7" sx={{ mr: '20px' }}>
										Vacuna antirrábica
									</Typography>
									<TextField
										InputProps={{
											readOnly: !editar,
										}}
										type="date"
										fullWidth
										id="antirrabica"
										name="antirrabica"
										value={antirrabica}
										variant="outlined"
										size="small"
										onChange={(event) => {
											setAntirrabica(event.target.value);
										}}
									/>
								</ListItemText>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h7" sx={{ mr: '20px' }}>
									Vacuna antienfermedades
								</Typography>
								<TextField
									InputProps={{
										readOnly: !editar,
									}}
									style={{ color: '#000' }}
									type="date"
									fullWidth
									id="antienfermedades"
									name="antienfermedades"
									value={antienfermedades}
									variant="outlined"
									size="small"
									onChange={(event) => {
										setAntienfermedades(event.target.value);
									}}
								/>
							</Grid>
						</Grid>
					</ListItem>
					<ListItem>
						<ListItemText>
							<Typography variant="h7" sx={{ mr: '20px' }}>
								Castrado
							</Typography>
							<TextField
								InputProps={{
									readOnly: !editar,
								}}
								select
								fullWidth
								id="castrado"
								name="castrado"
								value={castrado}
								variant="outlined"
								size="small"
								onChange={(event) => {
									setCastrado(event.target.value);
								}}
							>
								<MenuItem value={false} key={'No castrado'}>
									No castrado
								</MenuItem>
								<MenuItem value={true} key={'Castrado'}>
									Castrado
								</MenuItem>
							</TextField>
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

export default HistorialClinicoPage;
