import { Context } from '../context/Context';
import { useEffect, useState, useCallback, useContext } from 'react';
import url from '../data/url';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Delete from '@mui/icons-material/DeleteForever';

// La tabla de perros recibe en props el id del usuario que va a mostrar los perros
function TablaPerros(props) {
    const { usuario } = useContext(Context); // Usuario con sesion activa del que se muestran los perros
	const token = localStorage.getItem('jwt');
	
    const [esVeterinario, setEsVeterinario] = useState(false); // Para ocultar o mostrar funciones de veterinarios

	//Habilita/muestra opciones en funcion de si entra un veterinario.
	useEffect(() => {
        if (usuario != null && usuario.rol === 'veterinario') {
            setEsVeterinario(true);
        }
    }, [usuario]);

    // Declara una snackbar para mostrar mensajes
    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null); // Manejador del cierre de la snackbar

    const [rows, setRows] = useState([]); // Filas de la tabla de perros a mostrar

    // Asigna a las filas los perros obtenidos de la BD.
    useEffect(() => {
        obtenerPerros().then((rows) => setRows(rows));
    }, []);

    // Manejador del borrado de los perros
    const handleDeleteClick = (id) => async () => {
		const response = await fetch(url + 'perros/delete/' + id, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				token: `${token}`,
			},
		});
		console.log(response);
		if (response.ok) {
			setSnackbar({
				children: 'Perro eliminado con exito',
				severity: 'success',
			});
			setRows(rows.filter((row) => row.id !== id));
		} else {
			setSnackbar({
				children: 'Error al conectar con la base de datos',
				severity: 'error',
			});
		}
	};

    // Obtiene los perros del usuario desde la BD.
    function obtenerPerros() {
        return fetch(url + 'perros/' + props.idUsuario, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                token: `${token}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    if (response.status == 401) {
                        console.log("No esta autorizado a ver los perros.");
                    }
                    return [];
                }
            })
            .then((perros) => {
                if (perros.length == 0) {
                    console.log("La tabla de perros esta vacia.");
                }
                return perros;
            })
            .catch((error) => {
                console.error('Error en el fetch: ' + error);
                return [];
            });
    }

    // Establece las columnas a mostrar de la tabla de perros.
    const columns = [
        // Datos de los perros: ID, nombre, raza, edad, enfermedad, sexo y caracteristicas
        { field: 'id', headerName: 'ID', width: 50, id: 'id' },
        { field: 'nombre', headerName: 'Nombre', width: 100 },
        { field: 'raza', headerName: 'Raza', width: 100 },
        { field: 'sexo', headerName: 'Sexo', width: 100 },
        { field: 'caracteristicas', headerName: 'Caracteristicas', width: 200 },
        { field: 'enfermedad', headerName: 'Enfermedad', width: 200 },
    ];

    // Si es veterinario se agrega la columna que permite borrar
    if (esVeterinario) {
        columns.push({
          field: 'actions',
          type: 'actions',
          width: 50,
          cellClassName: 'actions',
          getActions: ({ id }) => {
            return [
              <GridActionsCellItem
                icon={<Delete />}
                key=""
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />,
            ];
          },
        });
    }

    return <div>
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                editMode="row"
                rows={rows}
                columns={columns}
            //processRowUpdate={processRowUpdate}
            //onProcessRowUpdateError={handleProcessRowUpdateError}
            //initialState={{ pagination: {
            //		paginationModel: { page: 0, pageSize: 5 } }
            //}}
            //pageSizeOptions={[5, 10]}
            />

            {!!snackbar && (
                // Declaracion de propiedades de la snackbar
                <Snackbar open
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={handleCloseSnackbar}
                    autoHideDuration={6000} >
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </div>
    </div>;
}

export default TablaPerros;