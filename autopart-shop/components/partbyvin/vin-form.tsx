'use client';
import { Button, Input } from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const initialForm = {
	vin_number: '',
	part_name: '',
	auto: '',
	model_auto: '2022'
};

export const VinForm = () => {
	const [forms, setForms] = useState([initialForm]);
	const router = useRouter();

	const handleInputChange = (
		index: number,
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;
		const updatedForms = [...forms];
		updatedForms[index] = { ...updatedForms[index], [name]: value };
		setForms(updatedForms);
	};

	const addForm = () => {
		setForms([...forms, { ...initialForm }]);
	};

	const removeForm = (index: number) => {
		const updatedForms = forms.filter((_, i) => i !== index);
		setForms(updatedForms);
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		localStorage.setItem('vin_order', JSON.stringify(forms));
		router.push('/checkout');
	};

	return (
		<form className='flex flex-col gap-4 w-[35%]' onSubmit={handleSubmit}>
			{forms.map((form, index) => (
				<div key={index} className='flex flex-col gap-4'>
					<Input
						name='vin_number'
						label={`VIN / Номер кузова* (${index + 1})`}
						labelPlacement='outside'
						required
						value={form.vin_number}
						onChange={e => handleInputChange(index, e)}
					/>
					<Input
						name='part_name'
						label='Название запчасти'
						labelPlacement='outside'
						value={form.part_name}
						onChange={e => handleInputChange(index, e)}
					/>
					<Input
						name='auto'
						label='Машина / Модель машины'
						labelPlacement='outside'
						value={form.auto}
						onChange={e => handleInputChange(index, e)}
					/>
					<Button
						className='hidden'
						type='button'
						onClick={() => removeForm(index)}
					>
						Удалить форму {index + 1}
					</Button>
				</div>
			))}
			<Button type='button' onClick={addForm} color='primary'>
				Добавить запчасть
			</Button>
			<Button type='submit'>Перейти к оформлению</Button>
		</form>
	);
};
