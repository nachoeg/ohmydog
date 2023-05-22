function NotFoundPage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<img
				style={{ width: '80vw', height: '80vh' }}
				src="/404error.svg"
				alt="Error 404 not found"
			/>
		</div>
	);
}

export default NotFoundPage;
