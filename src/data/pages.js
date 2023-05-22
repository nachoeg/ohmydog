const pages = [
	{ nombre: 'Adopcion', url: '/adopcion' },
	{ nombre: 'Perdidos', url: '/perdidos' },
	{ nombre: 'Campañas', url: '/campañas' },
	{ nombre: 'Cruza', url: '/cruza' },
	{ nombre: 'Servicios externos', url: '/servicios' },
];

const pagesLoggedUsers = [...pages, { nombre: 'Turnos', url: '/turnos' }];

const pagesAdminUsers = [
	...pagesLoggedUsers,
	{ nombre: 'Usuarios', url: '/usuarios' },
	{ nombre: 'Perros', url: '/perros' },
];

const settings = [
	{ nombre: 'Perfil', url: '/perfil' },
	{ nombre: 'Mis perros', url: '/misperros' },
	{ nombre: 'Registrar usuario', url: '/signup' },
	{ nombre: 'Solicitar turno', url: '/turnos/register' },
];

export { pages, settings, pagesLoggedUsers, pagesAdminUsers };
