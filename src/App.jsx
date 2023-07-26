import { BrowserRouter, Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LogInPage from "./pages/InicioSesionPage";
import HomePage from "./pages/InicioPage";
import NotFoundPage from "./pages/Error404Page";
import SignUpPage from "./pages/RegistrarPage";
import UsersPage from "./pages/UsuariosPage";
import Turns from "./pages/TurnosPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/UsuarioPerfilPage";
import MyDogsPage from "./pages/MisPerrosPage";
import LoadDogPage from "./pages/PerrosRegistrarPage";
import UserDogsPage from "./pages/PerrosUsuarioPage";
import AllDogsPage from "./pages/PerrosPage";
import ChangePassword from "./pages/CambiarContraseñaPage";
import AdoptPage from "./pages/AdopcionesPage";
import AdoptRegisterPage from "./pages/AdopcionesRegistrarPage";
import HistorialClinicoPage from "./pages/HistorialClinicoPage";
import MyTurnsPage from "./pages/MisTurnosPage";
import AddTurn from "./pages/TurnosRegistrarPage";
import DogsUsersTurnsPage from "./pages/TurnosPerroPage";
import GetDataForAdoptPage from "./pages/AdopcionesPedirDatosPage";
import ConfirmAdoptPage from "./pages/AdopcionesConfirmarPage";
import CampaniasPage from "./pages/CampañasPage";
import RegisterCampaniaPage from "./pages/CampañasRegistrarPage";
import CampaniaProfilePage from "./pages/CampañaPerfilPage";
import DonarPage from "./pages/DonarPage";
import OldCampainsPage from "./pages/CampañasArchivadasPage";
import TablaTurnos from "./components/TablaTurnos";
import LostDogsPage from "./pages/PerrosPerdidosPage";
import LostDogsRegisterPage from "./pages/PerrosPerdidosRegistrarPage";
import ServiciosExternosPage from "./pages/ServiciosExternosPage";
import PaseadoresCuidadoresPage from "./pages/PaseadoresCuidadoresPage";
import GuarderiasPage from "./pages/GuarderiasPage";
import RegistrarPaseadorCuidador from "./pages/RegistrarPaseadorCuidador";
import PaseadoresCuidadoresBorradosPage from "./pages/PaseadoresCuidadoresArchivadosPage";
import PaseadorCuidadorProfilePage from "./pages/PaseadorCuidadorPerfilPage";
import CruzasPage from "./pages/CruzasPage";
import MarcarPerroParaCruzar from "./pages/CruzasMarcarPerroPage";
import OpcionesDeCruza from "./pages/CruzasOpcionesPage";
import PerrosBorrados from "./pages/PerrosArchivadosPage";
import UsuariosBorradosPage from "./pages/UsuariosArchivadosPage";
import BouchersPage from "./pages/BouchersPage";

function App() {
	const theme = createTheme({
		status: {
			danger: "#e53e3e",
		},
		palette: {
			primary: {
				main: "#0197b2",
				dark: "#00616d",
			},
			secondary: {
				main: "#ff914d",
				dark: "#b3561b",
			},
			neutral: {
				main: "#64748B",
				dark: "#404a59",
				contrastText: "#fff",
			},
			tertiary: {
				main: "#b20197",
				dark: "#840085",
				contrastText: "#fff",
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
								element={<TablaTurnos urlTurnos="" filtro={"hoy"} />}
							/>
							<Route
								path="asistidos"
								element={<TablaTurnos urlTurnos="" filtro={"asistidos"} />}
							/>
							<Route
								path="no-asistidos"
								element={<TablaTurnos urlTurnos="" filtro={"no-asistidos"} />}
							/>
						</Route>
						<Route path="campanias" element={<CampaniasPage />} />
						<Route path="campanias/donar/:nombre" element={<DonarPage />} />
						<Route
							path="campanias/registrar"
							element={<RegisterCampaniaPage />}
						/>
						<Route path="campanias/archivadas" element={<OldCampainsPage />} />
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
						<Route path="perdidos" element={<LostDogsPage />} />
						<Route
							path="perdidos/registrar"
							element={<LostDogsRegisterPage />}
						/>
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
							path="adopciones/confimar/:idPerro"
							element={<ConfirmAdoptPage />}
						/>
						<Route path="servicios" element={<ServiciosExternosPage />} />
						<Route
							path="servicios/paseadores-cuidadores"
							element={<PaseadoresCuidadoresPage />}
						/>
						<Route
							path="servicios/paseadores-cuidadores/registrar"
							element={<RegistrarPaseadorCuidador />}
						/>
						<Route
							path="servicios/paseadores-cuidadores/archivados"
							element={<PaseadoresCuidadoresBorradosPage />}
						/>
						<Route
							path="servicios/paseadores-cuidadores/perfil/:id"
							element={<PaseadorCuidadorProfilePage />}
						/>
						<Route path="perros/borrados" element={<PerrosBorrados />} />
						<Route
							path="usuarios/borrados"
							element={<UsuariosBorradosPage />}
						/>
						<Route path="cruzas" element={<CruzasPage />} />
						<Route path="cruzas/agregar" element={<MarcarPerroParaCruzar />} />
						<Route
							path="cruzas/opciones/:id/:nombrePerro"
							element={<OpcionesDeCruza />}
						/>
						<Route path="servicios/guarderias" element={<GuarderiasPage />} />
						<Route path="campanias/descuentos" element={<BouchersPage />} />
						<Route path="cambiar-contraseña" element={<ChangePassword />} />
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				</Routes>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
