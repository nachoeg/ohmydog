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
} from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import PhoneIcon from '@mui/icons-material/Phone';
import MapIcon from '@mui/icons-material/Map';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import { Context } from '../context/Context';
import { useContext } from 'react';

function ProfilePage() {
	const { usuario } = useContext(Context);
	return (
		<Container component="main" maxWidth="sm">
			<Card sx={{ padding: '10px', marginTop: 8 }}>
				<List>
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
						<ListItemIcon sx={{ mr: '5px' }}>
							<EmailIcon sx={{ mr: '5px' }} />
							Email:
						</ListItemIcon>

						<ListItemText>
							<Typography>{usuario.email}</Typography>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemIcon sx={{ mr: '5px' }}>
							<HttpsIcon sx={{ mr: '5px' }} />
							Contraseña:
						</ListItemIcon>
						<ListItemText>
							<Typography>{usuario.password}</Typography>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemIcon sx={{ mr: '5px' }}>
							<PhoneIcon sx={{ mr: '5px' }} />
							Telefono:
						</ListItemIcon>
						<ListItemText>
							<Typography>{usuario.telefono}</Typography>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemIcon sx={{ mr: '5px' }}>
							<MapIcon sx={{ mr: '5px' }} />
							Localidad:
						</ListItemIcon>
						<ListItemText>
							<Typography>{usuario.localidad}</Typography>
						</ListItemText>
					</ListItem>
					<ListItem>
						<ListItemIcon sx={{ mr: '5px' }}>
							<MapsHomeWorkIcon sx={{ mr: '5px' }} />
							Direccion:
						</ListItemIcon>
						<ListItemText>
							<Typography>{usuario.direccion}</Typography>
						</ListItemText>
					</ListItem>
				</List>
			</Card>
		</Container>
	);
}

export default ProfilePage;
