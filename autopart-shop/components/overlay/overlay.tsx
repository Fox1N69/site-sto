// components/Overlay.tsx
import React from 'react';

interface OverlayProps {
	visible: boolean;
	onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ visible, onClose }) => {
	if (!visible) return null;

	return (
		<>
			{/* Фоновый слой с эффектом мутного стекла */}
			<div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50'>
				{/* Модальное окно */}
				<div className='bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg text-center'>
					<h2 className='text-xl font-bold mb-4'>
						К сожалению, эта часть сайта еще в разработке
					</h2>
					<p className='mb-6'>
						Пожалуйста, вернитесь позже или свяжитесь с нами для получения
						дополнительной информации.
					</p>
					<button
						onClick={onClose}
						className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
					>
						Закрыть
					</button>
				</div>
			</div>
		</>
	);
};

export default Overlay;
