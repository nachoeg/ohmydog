import { Container } from "@mui/material";
import { useEffect, useState, useCallback, useContext } from "react";
import { Context } from "../context/Context";
import { Button } from "@mui/material";
import TablaCampanias from "../components/TablaCampanias";
import { NavLink } from "react-router-dom";
import { Add } from "@mui/icons-material";

function CampaniasPage() {
	const { usuario } = useContext(Context);
	const token = localStorage.getItem("jwt");

	const [esVeterinario, setEsVeterinario] = useState(false); // Para ocultar o mostrar funciones de veterinarios

	//Habilita/muestra opciones en funcion de si entra un veterinario.
	useEffect(() => {
		if (usuario != null && usuario.rol === "veterinario") {
			setEsVeterinario(true);
		}
	}, [usuario]);

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
			<TablaCampanias />
			{esVeterinario && (
				<>
					<Button
						fullWidth
						color='tertiary'
						variant='contained'
						component={NavLink}
						to={`archivadas`}
						style={{ marginTop: "10px" }}
					>
						Ver campañas borradas y/o finalizadas
					</Button>
					<Button
						fullWidth
						variant='contained'
						startIcon={<Add />}
						component={NavLink}
						to={`registrar`}
						style={{ marginTop: "10px" }}
					>
						Registrar campaña
					</Button>
					<Button
						fullWidth
						variant='contained'
						component={NavLink}
						to={`/descuentos`}
						style={{ marginTop: "10px" }}
					>
						Comprobar descuento
					</Button>
				</>
			)}
		</Container>
	);
}

export default CampaniasPage;
