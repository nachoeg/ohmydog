import { createContext, useEffect, useState } from 'react';
export const Context = createContext();

export function ContextProvider(props) {
	const [auth, setAuth] = useState(localStorage.getItem('jwt') != null);
	const usuario = JSON.parse(localStorage.getItem('usuario'));

	useEffect(() => {
		setAuth(localStorage.getItem('jwt') != null);
	}, []);
	return (
		<Context.Provider
			value={{
				auth,
				usuario,
			}}
		>
			{props.children}
		</Context.Provider>
	);
}
