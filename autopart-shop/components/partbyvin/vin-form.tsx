'use client';
import { Button, Input } from '@nextui-org/react';
import { useState } from 'react';

export const VinForm = () => {
	const [vin, setVin] = useState();

	const handleOnChange = (e: any) => {
		setVin(e);
	};

	return (
		<>
			<form className='flex flex-col gap-4 w-[35%]' action=''>
				<Input label='VIN / Номер кузова*' labelPlacement='outside' required />
				<Input label='Название запчасти' labelPlacement='outside' />
				<Input label='Машина / Модель машины' labelPlacement='outside' />
			</form>
		</>
	);
};
