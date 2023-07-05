import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogInPage from './pages/LogInPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SignUpPage from './pages/SignUpPage';
import UsersPage from './pages/UsersPage';
import Turns from './pages/Turns';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import MyDogsPage from './pages/MyDogsPage';
import LoadDogPage from './pages/LoadDogPage';
import UserDogsPage from './pages/UserDogsPage';
import AllDogsPage from './pages/AllDogsPage';
import ChangePassword from './pages/ChangePasswordPage';
import AdoptPage from './pages/AdoptPage';
import AdoptRegisterPage from './pages/AdoptRegisterPage';
import HistorialClinicoPage from './pages/HistorialClinicoPage';
import MyTurnsPage from './pages/MyTurnsPage';
import AddTurn from './pages/AddTurnPage';
import DogsUsersTurnsPage from './pages/DogsUsersTurnsPage';
import GetDataForAdoptPage from './pages/GetDataForAdoptPage';
import ConfirmAdoptPage from './pages/ConfirmAdoptPage';
import CampaniasPage from './pages/CampaniasPage';
import RegisterCampaniaPage from './pages/RegisterCampaniaPage';
import CampaniaProfilePage from './pages/CampaniaProfilePage';
import DonarPage from './pages/DonarPage';
import OldCampainsPage from './pages/OldCampainsPage';
import Logotipo from './components/Logotipo';
import TablaTurnos from './components/TablaTurnos';

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
						<Route path="usuarios/registrar" element={<SignUpPage />} />
						<Route path="usuarios" element={<UsersPage />} />
						<Route path="turnos/" element={<Turns />}>
							<Route path="todos" element={<TablaTurnos urlTurnos="" />} />
							<Route
								path="hoy"
								element={<TablaTurnos urlTurnos="" filtro={'hoy'} />}
							/>
							<Route
								path="asistidos"
								element={<TablaTurnos urlTurnos="" filtro={'asistidos'} />}
							/>
							<Route
								path="no-asistidos"
								element={<TablaTurnos urlTurnos="" filtro={'no-asistidos'} />}
							/>
						</Route>
						<Route path="campanias" element={<CampaniasPage />} />
						<Route path="campanias/donar/:nombre" element={<DonarPage />} />
						<Route
							path="campanias/registrar_campania"
							element={<RegisterCampaniaPage />}
						/>
						<Route
							path="campanias/campaniasBorradasyPasadas"
							element={<OldCampainsPage />}
						/>
						<Route path="campanias/:id" element={<CampaniaProfilePage />} />
						<Route
							path="turnos/cliente/:id/:nombre"
							element={<DogsUsersTurnsPage />}
						/>
						<Route
							path="turnos/perro/:id/:nombre"
							element={<DogsUsersTurnsPage />}
						/>
						<Route path="mis-perros" element={<MyDogsPage />} />
						<Route path="mis-turnos" element={<MyTurnsPage />} />
						<Route path="mis-turnos/solicitar-turno" element={<AddTurn />} />
						<Route path="perros" element={<AllDogsPage />} />
						<Route path="adopcion" element={<AdoptPage />} />
						<Route path="adopcion/registrar" element={<AdoptRegisterPage />} />
						<Route path="perfil/:idUsuario" element={<ProfilePage />} />
						<Route
							path="agregar-perro/:idUsuario/:nombre"
							element={<LoadDogPage />}
						/>
						<Route
							path="perros/usuario/:idUsuario/:nombre"
							element={<UserDogsPage />}
						/>
						<Route
							path="historial-clinico/:idPerro"
							element={<HistorialClinicoPage />}
						/>
						<Route
							path="pedir-datos-para-adoptar/:idPerro"
							element={<GetDataForAdoptPage />}
						/>
						<Route
							path="confirmar-adopcion/:idPerro"
							element={<ConfirmAdoptPage />}
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
