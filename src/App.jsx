import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogInPage from './pages/LogInPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SignUpPage from './pages/SignUpPage';
import UsersPage from './pages/UsersPage';
import TurnosPage from './pages/TurnosPage';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import MyDogsPage from './pages/MyDogsPage';
import LoadDogPage from './pages/LoadDogPage';
import UserDogsPage from './pages/UserDogsPage';
import AllDogsPage from './pages/AllDogsPage';
import { purple } from '@mui/material/colors';
import ChangePassword from './pages/ChangePassword';

function App() {
	const theme = createTheme({
		status: {
			danger: '#e53e3e',
		},
		palette: {
			primary: {
				main: '#0197b2',
				dark: '#00616d',
			},
			secondary: {
				main: '#ff914d',
				dark: '#b3561b',
			},
			neutral: {
				main: '#64748B',
				contrastText: '#fff',
			},
			tertiary: {
				main: '#b20197',
				dark: '#840085',
				contrastText: '#fff',
			},
		},
	});

	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Routes>
					<Route path="/" element={<Navbar />}>
						<Route index element={<HomePage />} />
						<Route path="login" element={<LogInPage />} />
						<Route path="signup" element={<SignUpPage />} />
						<Route path="perfil" element={<ProfilePage />} />
						<Route path="usuarios" element={<UsersPage />} />
						<Route path="turnos" element={<TurnosPage />} />
						<Route path="mis-perros" element={<MyDogsPage />} />
						<Route path="perros" element={<AllDogsPage />} />
						<Route
							path="agregar-perro/:idUsuario/:nombre"
							element={<LoadDogPage />}
						/>
						<Route
							path="perros-usuario/:idUsuario/:nombre"
							element={<UserDogsPage />}
						/>
						<Route path="cambiar-contraseña" element={<ChangePassword />} />
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				</Routes>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
