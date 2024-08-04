// pages/index.tsx
'use client';
import { Button, Input } from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const VinForm = () => {
	const [vin, setVin] = useState('');
	const [partName, setPartName] = useState('');
	const [auto, setAuto] = useState('');
	const router = useRouter();

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		// Сохраняем данные в localStorage или другой метод для передачи на следующую страницу
		localStorage.setItem(
			'vin_order',
			JSON.stringify({
				vin_number: vin,
				part_name: partName,
				auto,
				model_auto: '2022'
			})
		);
		router.push('/checkout');
	};

	return (
		<>
			<form className='flex flex-col gap-4 w-[35%]' onSubmit={handleSubmit}>
				<Input
					label='VIN / Номер кузова*'
					labelPlacement='outside'
					required
					value={vin}
					onChange={e => setVin(e.target.value)}
				/>
				<Input
					label='Название запчасти'
					labelPlacement='outside'
					value={partName}
					onChange={e => setPartName(e.target.value)}
				/>
				<Input
					label='Машина / Модель машины'
					labelPlacement='outside'
					value={auto}
					onChange={e => setAuto(e.target.value)}
				/>
				<Button type='submit'>Перейти к оформлению</Button>
			</form>
		</>
	);
};
