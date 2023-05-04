import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogInPage from './pages/LogInPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import CssBaseline from '@mui/material/CssBaseline';
import SignUpPage from './pages/SignUpPage';
// import { ThemeProvider } from '@mui/material/styles';

import './App.css';
import Navbar from './components/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
	const theme = createTheme({
		status: {
			danger: '#e53e3e',
		},
		palette: {
			primary: {
				main: '#0197b2',
				darker: '#053e85',
			},
			neutral: {
				main: '#64748B',
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
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				</Routes>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
