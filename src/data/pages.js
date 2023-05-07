const pages = [
	{ nombre: 'Adopcion', url: '/adopcion' },
	{ nombre: 'Perdidos', url: '/perdidos' },
	{ nombre: 'Campañas', url: '/campañas' },
	{ nombre: 'Cruza', url: '/cruza' },
	{ nombre: 'Servicios externos', url: '/servicios' },
];

const pagesAuth = [
	...pages,
	{ nombre: 'Turnos', url: '/turnos' },
	{ nombre: 'Usuarios', url: '/usuarios' },
];

const settings = [
	{ nombre: 'Perfil', url: '/perfil' },
	{ nombre: 'Mis perros', url: '/misperros' },
	{ nombre: 'Registrar usuario', url: '/signup' },
];

export { pages, settings, pagesAuth };
