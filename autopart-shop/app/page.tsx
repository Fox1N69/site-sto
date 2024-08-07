'use client';

import { useFetchAutoParts, useFetchBrands } from '@/hooks/fetching';
import { PartCard } from '@/components/autopart/ProductCard/PartCard';
import { CategoryCard } from '@/components/home/CategoryCard';
import BrandCard from '@/components/home/BrandCard';
import { useState } from 'react';
import { PartByVin } from '@/components/partbyvin';
import PageActions from '@/components/pageactions/pageactions';
import { VinForm } from '@/components/partbyvin/vin-form';
import Overlay from '@/components/overlay/overlay';

export default function Home() {
	const [activeSection, setActiveSection] = useState('vin');
	const autoParts = useFetchAutoParts();
	const brands = useFetchBrands();

	const handleSelectSection = (section: string) => {
		setActiveSection(section);
	};

	return (
		<main className='flex flex-col items-center p-4 gap-20'>
			<PageActions onSelectSection={handleSelectSection} />
			{activeSection === 'all' && (
				<>
					<Overlay
						visible={activeSection === 'all'}
						onClose={() => setActiveSection('vin')}
					/>
					<div className='main__container w-full max-w-screen-xl'>
						<section className='brand__cards flex flex-col gap-4'>
							<h3 className='font-bold text-xl md:text-2xl'>Бренды</h3>
							<div className='flex flex-wrap gap-5 lg:flex-nowrap'>
								{brands.slice(0, 5).map(brand => (
									<BrandCard key={brand.id} brand={brand} />
								))}
							</div>
						</section>

						<section className='category__cards flex flex-col gap-4 mt-12 md:mt-20'>
							<h3 className='font-bold text-xl md:text-2xl'>Категории</h3>
							<div className='flex gap-12 flex-wrap lg:flex-nowrap'>
								<CategoryCard key={1} id={1} name='Двигатель' />
								<CategoryCard key={2} id={2} name='Кузов' />
								<CategoryCard key={3} id={3} name='Электроника' />
								<CategoryCard key={4} id={4} name='Ходовая часть' />
								<CategoryCard key={5} id={5} name='Трансмиссия' />
							</div>
						</section>

						<section className='flex flex-col mt-12 md:mt-20 gap-4'>
							<h3 className='font-bold text-xl md:text-2xl'>
								Новые автозапчасти
							</h3>
							<div className='autopart__cards flex flex-wrap gap-5 justify-center lg:flex-nowrap'>
								{autoParts.slice(0, 5).map(part => (
									<PartCard key={part.id} part={part} />
								))}
							</div>
						</section>
					</div>
				</>
			)}
			{activeSection === 'vin' && <VinForm />}
		</main>
	);
}
