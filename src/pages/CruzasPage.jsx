import { Container } from "@mui/material";
import { useContext, useState, useEffect, useCallback } from "react";
import { Context } from "../context/Context";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import TablaCruzas from "../components/TablaCruzas";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Tooltip,
} from "@mui/material";
import { Add, Favorite, Healing, Pets } from "@mui/icons-material";

function CruzasPage() {
	const { usuario } = useContext(Context);
	const token = localStorage.getItem("jwt");

	const [esVeterinario, setEsVeterinario] = useState(false); // Para ocultar o mostrar funciones de veterinarios

	// Habilita/muestra opciones en función de si entra un veterinario.
	useEffect(() => {
		if (usuario != null && usuario.rol === "veterinario") {
			setEsVeterinario(true);
		}
	}, [usuario]);

	// Comprueba si el diálogo sobre las adopciones ya se mostró anteriormente
	useEffect(() => {
		const confirmado = localStorage.getItem("confirmado");
		if (!confirmado && !esVeterinario) {
			setOpenConfirmar(true);
			localStorage.setItem("confirmado", "true");
		}
	}, []);

	const [openConfirmar, setOpenConfirmar] = useState(false);

	const handleCloseConfirmar = () => {
		setOpenConfirmar(false);
	};

	return (
		<Container
			component="main"
			maxWidth="lg"
			sx={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				mt: 4,
			}}
		>
			<TablaCruzas />
			<Dialog
				open={openConfirmar}
				onClose={handleCloseConfirmar}
				aria-labelledby="confirmar-title"
				aria-describedby="confirmar-description"
			>
				<DialogTitle id="confirmar-title">
					Te queriamos contar que desde OhMyDog creemos que adoptar siempre es
					una mejor opcion que hacer cruzas. Te sugerimos entrar al link de la
					pagina de adopciones, hay muchos perritos esperando encontrar un
					hogar!
				</DialogTitle>
				<DialogActions>
					<Button onClick={handleCloseConfirmar} color="inherit" sx={{ mr: 1 }}>
						Cerrar
					</Button>
					<Button
						variant="contained"
						color="success"
						endIcon={<Favorite />}
						component={NavLink}
						to={"/adopciones"}
						autoFocus
					>
						Adopciones
					</Button>
				</DialogActions>
			</Dialog>
			{usuario != null && !esVeterinario && (
				<Button
					fullWidth
					variant="contained"
					component={NavLink}
					to="../cruzas/agregar"
					startIcon={<Add />}
					sx={{ mt: 1 }}
				>
					Agregar perro
				</Button>
			)}
		</Container>
	);
}

export default CruzasPage;
