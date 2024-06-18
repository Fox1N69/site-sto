import ModelAutoCard from '@/components/model-auto/ModelCard';

export default function BrandPage({ params }: { params: { id: number } }) {
	return (
		<div>
			<div className='container'>
				<ModelAutoCard
					model={{
						id: params.id,
						name: 'bmw',
						brand: params.id,
						img_url: ''
					}}
				/>
			</div>
		</div>
	);
}
