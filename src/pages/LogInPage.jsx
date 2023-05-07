import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../components/Copyright';
import { useNavigate } from 'react-router-dom';
import backend from '../data/url.json';

export default function LogInPage() {
	const navigate = useNavigate();
	const estaAutenticado = true;

	// const [username, setUsername] = useState('');
	// const [password, setPassword] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		console.log({
			email: data.get('email'),
			password: data.get('password'),
		});
		// let url =
		// 	backend.url + 'login?' + data.get('email') + '&' + data.get('password');
		// fetch(url)
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		if (data.jwt != null) {
		// 			localStorage.setItem('jwt', data.jwt);
		// 			navigate('/');
		// 		} else {
		// 			alert('contraseña incorrecta');
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.error('HUBO UN ERROR: ' + error);
		// 	});
		if (true) {
			localStorage.setItem('jwt', '1234');
			location.replace('/');
		} else {
			alert('Datos incorrectos');
		}
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
