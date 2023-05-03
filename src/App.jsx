import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogInPage from './pages/LogInPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import CssBaseline from '@mui/material/CssBaseline';
// import { ThemeProvider } from '@mui/material/styles';

import './App.css';
import Navbar from './components/Navbar';

function App() {
	return (
		<BrowserRouter>
			{/* Aca va el theme provider? */}
			<CssBaseline />

			<Navbar />

			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LogInPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
