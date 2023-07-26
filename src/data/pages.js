const pages = [
	{ nombre: "Adopciones", url: "/adopciones" },
	{ nombre: "Perdidos", url: "/perdidos" },
	{ nombre: "Campañas", url: "/campanias" },
	{ nombre: "Cruzas", url: "/cruzas" },
];

const pagesLoggedUsers = [...pages, { nombre: "Turnos", url: "/mis-turnos" }];

const pagesAdminUsers = [
	...pages,
	{ nombre: "Turnos", url: "/turnos" },
	{ nombre: "Usuarios", url: "/usuarios" },
	{ nombre: "Perros", url: "/perros" },
];

const settings = [
	{ nombre: "Perfil", url: "/perfil" },
	{ nombre: "Perros", url: "/mis-perros" },
	{ nombre: "Registrar usuario", url: "/signup" },
	{ nombre: "Solicitar turno", url: "/turnos/register" },
];

export { pages, settings, pagesLoggedUsers, pagesAdminUsers };
