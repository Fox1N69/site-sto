import { Input } from '@nextui-org/react';
import { VinForm } from './vin-form';

export const PartByVin = () => {
	return (
		<>
			<section className='w-full flex flex-col justify-center items-center gap-4'>
				<h2 className='text-2xl font-meium'>Заказать запчасть по VIN номеру</h2>
				<VinForm />
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
					voluptatum!
				</p>
			</section>
		</>
	);
};
