import { Context } from '../context/Context';
import { useContext } from 'react';

function MyDogsPage() {
	const { usuario } = useContext(Context);
	if (usuario == null) {
		location.replace('/login');
	}
	if (usuario.rol == 'veterinario') {
		location.replace('/');
	}
	return <div>MyDogsPage</div>;
}

export default MyDogsPage;
