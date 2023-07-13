import { Container } from "@mui/material";
import TablaPerros from "../components/TablaPerros";
import Typography from "@mui/material/Typography";

// La tabla de perros recibe en props el id del usuario que va a mostrar los perros
function PerrosBorrados() {
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
			<Typography component="h1" variant="h5" sx={{ mb: 1 }}>
				Perros borrados
			</Typography>
			<TablaPerros borrados={true} />
		</Container>
	);
}

export default PerrosBorrados;
