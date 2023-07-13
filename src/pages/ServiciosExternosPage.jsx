import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";

function ServiciosExternosPage() {
	return (
		<Container
			component="main"
			maxWidth="sm"
			sx={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				justifyContent: "center", // Agregado para centrar verticalmente
				height: "100vh", // Agregado para ocupar toda la pantalla verticalmente
			}}
		>
			<NavLink
				to="/servicios/paseadores-cuidadores"
				style={{ textDecoration: "none", width: "100%" }}
			>
				<Button
					sx={{ mt: 2, width: "100%" }}
					variant="contained"
					color="tertiary"
				>
					Paseadores y cuidadores
				</Button>
			</NavLink>
			<NavLink
				to="/servicios/guarderias"
				style={{ textDecoration: "none", width: "100%" }}
			>
				<Button
					sx={{ mt: 2, width: "100%" }}
					variant="contained"
					color="tertiary"
				>
					Guarderias
				</Button>
			</NavLink>
		</Container>
	);
}

export default ServiciosExternosPage;
