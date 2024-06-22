const AutoPart = ({ params }: { params: { id: number } }) => {
	return (
		<section>
			<div>{params.id}</div>
		</section>
	);
};

export default AutoPart;
