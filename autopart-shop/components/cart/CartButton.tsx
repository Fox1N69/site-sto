import { Button } from '@nextui-org/button';
import { Icon } from '@iconify/react';
import { useCartStore } from '@/store/cartStore';
import { Badge } from '@nextui-org/react';
import { useTypedSelector } from '@/store/useTypedSelector';
import { CartIcon } from '../icons/cart/CartIcon';

type CartButtonProps = {
	onClick: () => void;
};

const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
	const itemCounts = useCartStore(state => state.itemCount);

	return (
		<div className='relative'>
			{itemCounts > 0 ? (
				<Badge color='danger' content={itemCounts} shape='circle'>
					<Button
						isIconOnly
						onClick={onClick}
						variant='ghost'
						aria-label='Cart'
					>
						<CartIcon size={24} height={24} width={24} fill='currentColor' />
					</Button>
				</Badge>
			) : (
				<Button isIconOnly onClick={onClick} variant='ghost'>
					<CartIcon size={24} height={24} width={24} fill='currentColor' />
				</Button>
			)}
		</div>
	);
};

export default CartButton;
