import { Container, Typography } from "@mui/material";
import { useEffect, useState, useCallback, useContext } from "react";
import { Context } from "../context/Context";
import { Button } from "@mui/material";
import TablaPaseadoresCuidadores from "../components/TablaPaseadoresCuidadores";
import { NavLink } from "react-router-dom";
import { Add } from "@mui/icons-material";

function PaseadoresCuidadoresPage() {
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
			component="main"
			maxWidth="lg"
			sx={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				mt: 4,
			}}
		>
			<Typography variant="h5" sx={{ mb: 1 }}>
				Paseadores y cuidadores
			</Typography>
			<TablaPaseadoresCuidadores />
			{esVeterinario && (
				<>
					<Button
						fullWidth
						color="tertiary"
						variant="contained"
						component={NavLink}
						to={`archivados`}
						style={{ marginTop: "10px" }}
					>
						Ver paseadores y cuidadores borrados y/o no disponibles
					</Button>
					<Button
						fullWidth
						variant="contained"
						startIcon={<Add />}
						component={NavLink}
						to={`registrar`}
						style={{ marginTop: "10px" }}
					>
						Registrar paseador o cuidador
					</Button>
				</>
			)}
		</Container>
	);
}

export default PaseadoresCuidadoresPage;
