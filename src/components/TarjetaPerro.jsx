import {
	CalendarMonth,
	Edit,
	Email,
	Image,
	Map,
	Pets,
	Save,
} from '@mui/icons-material';
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	TextField,
} from '@mui/material';
import { useState } from 'react';

function TarjetaPerro({ datos }) {
	console.log(datos);
	const [editar, setEditar] = useState(false);
	const id = 2;
	const handleEditarClick = () => {
		setEditar(true);
	};
	const handleGuardarClick = () => {
		setEditar(false);
	};
	return (
		<Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
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
				image={datos.imagen}
				title="foto del perro"
			/>
			<>
				<CardContent>
					{/* <Typography gutterBottom variant="h5" component="div">
						{datos.nombre}
					</Typography> */}
					{/* <Divider sx={{ mb: 1 }} /> */}

					<List
						component="form"
						sx={{ minWidth: 250 }}
						// onSubmit={handleSubmit}
					>
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
									value={datos.nombre}
									onChange={(event) => {
										// setEmail(event.target.value);
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
									label="Correo Electrónico"
									InputProps={{
										readOnly: !editar,
									}}
									required
									fullWidth
									name="email"
									id="email"
									value={datos.email}
									onChange={(event) => {
										// setEmail(event.target.value);
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
									value={datos.fecha}
									onChange={(event) => {
										// setEmail(event.target.value);
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
									value={datos.zona}
									onChange={(event) => {
										// setEmail(event.target.value);
									}}
									variant="outlined"
									size="small"
								/>
							</ListItemText>
						</ListItem>
					</List>
					{datos.idDuenio == id && (
						<CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
							{!editar ? (
								<Button
									size="small"
									startIcon={<Edit />}
									onClick={handleEditarClick}
									fullWidth
									variant="contained"
								>
									Editar
								</Button>
							) : (
								<>
									<Button
										size="small"
										startIcon={<Image />}
										// onClick={handleEditarClick}
										fullWidth
										variant="contained"
										color={'tertiary'}
									>
										Foto
									</Button>
									<Button
										size="small"
										startIcon={<Save />}
										onClick={handleGuardarClick}
										fullWidth
										color={'success'}
										variant="contained"
									>
										Guardar
									</Button>
								</>
							)}
						</CardActions>
					)}
				</CardContent>
			</>
		</Card>
	);
}

export default TarjetaPerro;
