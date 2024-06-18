'use client';
import { AutoPart } from '@/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AutoPartPage({ params }: { params: { id: number } }) {
	const router = useRouter();
	const { model_name, year } = router.query;
	const [autoParts, setAutoParts] = useState<AutoPart[]>([]);

	useEffect(() => {
		if (model_name && year) {
			fetchAutoParts(model_name as string, year as string);
		}
	}, [model_name, year]);

	const fetchAutoParts = async (modelName: string, year: string) => {
		try {
			const response = await fetch(
				`http://localhost:4000/shop/auto-parts?model_name=${encodeURIComponent(modelName)}&year=${year}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch auto parts');
			}
			const data = await response.json();
			setAutoParts(data);
		} catch (error) {
			console.error('Error fetching auto parts:', error);
		}
	};

	return (
		<div>
			<h1>
				Auto Parts for {model_name} {year}
			</h1>
			<ul>
				{autoParts.map(part => (
					<li key={part.id}>
						{part.name} - ${part.price}
					</li>
				))}
			</ul>
		</div>
	);
}
