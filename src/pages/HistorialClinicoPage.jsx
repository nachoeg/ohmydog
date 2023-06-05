import { useLocation } from "react-router-dom"; // Para obtener el parametro pasado por la url

// La pagina del historial clinico recibe el ID del perro, su nombre y el nombre de su dueño y muestra:
// Sus enfermedades (si tuviera), las vacunas que se dio junto con sus fechas
// Una tabla con los turnos que solicito y realmente asistio.

function HistorialClinicoPage() {
  // Obtiene el id del perro que se pasa como parametro en la url
  const location = useLocation();
  const idPerro = location.pathname.split("/")[2];
  const token = localStorage.getItem("jwt"); // Token de la sesion activa

  return <h1>Pagina de historial clinico del perro {idPerro}</h1>;
}

export default HistorialClinicoPage;
