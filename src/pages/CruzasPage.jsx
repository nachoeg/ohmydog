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

	const handleClickOpenConfirmar = () => {
		setOpenConfirmar(true);
	};

	const handleCloseConfirmar = () => {
		window.open("/adopcion", "_blank", "noopener"); // Abre una nueva pestaña con la página "adopciones"
		setOpenConfirmar(false);
	};

	return (
		<Container
			component='main'
			maxWidth='lg'
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
				aria-labelledby='confirmar-title'
				aria-describedby='confirmar-description'
			>
				<DialogTitle id='confirmar-title'>
					Te queriamos contar que desde Oh My Dog! creemos que adoptar siempre
					es una mejor opcion que hacer cruzas. Hay muchos perritos esperando
					encontrar un hogar! Por eso, abriremos un link a la pagina de
					adopciones♥
				</DialogTitle>
				<DialogActions>
					<Button
						variant='contained'
						color='success'
						onClick={() => {
							handleCloseConfirmar();
						}}
						autoFocus
					>
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
			{usuario != null && !esVeterinario && (
				<Button
					fullWidth
					variant='contained'
					component={NavLink}
					to='../marcarPerro'
					style={{ marginTop: "10px" }}
				>
					+ Agregar perro
				</Button>
			)}
		</Container>
	);
}

export default CruzasPage;
