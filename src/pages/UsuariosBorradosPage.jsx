import { Container } from "@mui/material";
import TablaUsuarios from "../components/TablaUsuarios";
import Typography from "@mui/material/Typography";

// La tabla de perros recibe en props el id del usuario que va a mostrar los perros
function UsuariosBorradosPage() {
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
			<Typography component='h2' variant='h5'>
				Usuarios borrados
			</Typography>
			<TablaUsuarios borrados={true} />
		</Container>
	);
}

export default UsuariosBorradosPage;
