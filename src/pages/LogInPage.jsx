import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import url from '../data/url';
import { Context } from '../context/Context';
import { useContext, useEffect } from 'react';

export default function LogInPage() {
	const { auth } = useContext(Context);

	useEffect(() => {
		if (auth) {
			location.replace('/');
		}
	});

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		fetch(url + 'auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
			body: JSON.stringify({
				email: data.get('email'),
				password: data.get('password'),
			}),
		})
			.then((response) => {
				console.log(response);
				if (!response.ok) {
					alert('Datos incorrectos');
					throw response.status;
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
				if (data.token != null) {
					localStorage.setItem('jwt', data.token);
					localStorage.setItem('usuario', JSON.stringify(data.usuario));
					location.replace('/');
				}
			})
			.catch((error) => {
				console.error('Error en el fetch: ' + error);
			});
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
		</Container>
	);
}
