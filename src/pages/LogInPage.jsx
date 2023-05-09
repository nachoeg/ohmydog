import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../components/Copyright';
import { useNavigate } from 'react-router-dom';
import { url as urlBackend } from '../data/url';

export default function LogInPage() {
	const navigate = useNavigate();
	// const estaAutenticado = true;

	// const [username, setUsername] = useState('');
	// const [password, setPassword] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const url = urlBackend + 'auth/login';
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				email: data.get('email'),
				password: data.get('password'),
			}),
		})
			.then((response) => {
				if (!response.ok) {
					throw `Server error: [${response.status}] [${response.statusText}] [${response.url}]`;
				}
				return response.json();
			})
			.then((data) => {
				if (data.jwt != null) {
					localStorage.setItem('jwt', data.jwt);
					navigate('/');
				} else {
					alert('contraseña incorrecta');
				}
			})
			.catch((error) => {
				console.error('Error en el fetch: ' + error);
			});
		// if (true) {
		// 	localStorage.setItem('jwt', '1234');
		// 	location.replace('/');
		// } else {
		// 	alert('Datos incorrectos');
		// }
		// console.log({
		// 	email: data.get('email'),
		// 	password: data.get('password'),
		// });
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					{'Iniciar Sesión'}
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Correo eletrónico"
						name="email"
						autoComplete="email"
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Contraseña"
						type="password"
						id="password"
						autoComplete="current-password"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Entrar
					</Button>
				</Box>
			</Box>
			<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	);
}
