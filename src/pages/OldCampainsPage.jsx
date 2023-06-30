import { Container } from "@mui/material";
import { useContext } from "react";
import { Context } from "../context/Context";
import { Button } from "@mui/material";
import TablaCampanias from "../components/TablaCampanias";
import { NavLink } from "react-router-dom";
import Typography from "@mui/material/Typography";

function OldCampainsPage() {
	const { usuario } = useContext(Context);
	const token = localStorage.getItem("jwt");

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
			<Typography component='h1' variant='h5'>
				Campañas borradas y/o vencidas
			</Typography>
			<Typography variant='body2' component='h1' style={{ marginTop: "10px" }}>
				Tenga en cuenta que al recuperar una campaña finalizada se elimina la
				fecha de fin, si desea que tenga una, agreguesela desde los detalles de
				la campaña.
			</Typography>
			{/* Borrados es para indicarle a la tabla que muestre las campanias viejas/borradas*/}
			<TablaCampanias borrados='true' />

			<Button
				fullWidth
				color={"success"}
				variant='contained'
				component={NavLink}
				to={`../campanias`}
				style={{ marginTop: "10px" }}
			>
				Volver
			</Button>
		</Container>
	);
}

export default OldCampainsPage;
