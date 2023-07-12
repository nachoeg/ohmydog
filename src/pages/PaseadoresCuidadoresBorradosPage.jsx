import { Container } from "@mui/material";
import { useEffect, useState, useCallback, useContext } from "react";
import { Context } from "../context/Context";
import TablaPaseadoresCuidadores from "../components/TablaPaseadoresCuidadores";
import Typography from "@mui/material/Typography";

function PaseadoresCuidadoresBorradosPage() {
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
			<Typography component='h1' variant='h5' style={{ marginBottom: "15px" }}>
				Paseadores y cuidadores borrados y/o no disponibles
			</Typography>
			<Typography
				variant='body2'
				component='h1'
				style={{ marginBotton: "20px" }}
			>
				Tenga en cuenta que al recuperar un paseador/cuidador cuyo estado es "No
				disponible" automaticamente se cambia su estado a "Disponible". Si lo
				desea, puede modificar el estado desde el perfil del mismo, pero volverá
				a estar en este listado.
			</Typography>
			{/* Borrados es para indicarle a la tabla que muestre los borrados y/o no disponibles*/}
			<TablaPaseadoresCuidadores borrados='true' />
		</Container>
	);
}

export default PaseadoresCuidadoresBorradosPage;
