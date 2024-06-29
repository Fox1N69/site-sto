'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import { AutoPart, Brand, ModelAuto, Product } from '@/types';

export const useFetchAutoParts = () => {
	const [autoParts, setAutoParts] = useState<AutoPart[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<AutoPart[]>(
					'http://localhost:4000/shop/autoparts'
				);
				setAutoParts(response.data);
			} catch (error) {
				console.error('Error fetching auto parts data:', error);
			}
		};

		fetchData();
	}, []);

	return autoParts;
};

export const useFetchCartItems = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const { data: session } = useSession();

	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const userId = session?.user.id;
				if (!userId) return;

				const response = await fetch(
					`http://localhost:4000/v1/account/user/${userId}/basket`,
					{
						headers: {
							Authorization: `Bearer ${session?.user.token}`
						}
					}
				);
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await response.json();

				const extractedProducts: Product[] = data.BasketItems.map(
					(item: any) => ({
						id: item.AutoPart.id,
						name: item.AutoPart.name,
						href: '#',
						color: item.AutoPart.model_name,
						price: item.AutoPart.price.toString(),
						quantity: item.quantity,
						imageSrc: item.AutoPart.img,
						imageAlt: item.AutoPart.name
					})
				);

				setProducts(extractedProducts);
			} catch (error) {
				console.error('Failed to fetch cart items', error);
			}
		};

		if (session) {
			fetchCartItems();
		}
	}, [session]);

	return products;
};

interface HandleAddToCartParams {
	userId: string;
	token: string;
	autopartID: number;
	quantity: number;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const handleAddToCart = async ({
	userId,
	token,
	autopartID,
	quantity,
	setIsLoading,
	setError
}: HandleAddToCartParams) => {
	setIsLoading(true);
	setError(null);
	try {
		const response = await fetch(
			`http://localhost:4000/v1/account/user/${userId}/basket/items`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					autopart_id: autopartID,
					quantity: quantity
				})
			}
		);

		if (!response.ok) {
			throw new Error('Failed to add item to cart');
		}
		// Handle successful response if needed
	} catch (error) {
		setError('Failed to add item to cart');
	} finally {
		setIsLoading(false);
	}
};

export const checkIfInCart = async (
	userId: string,
	token: string,
	autopartIDs: number[]
): Promise<{ [key: number]: boolean }> => {
	try {
		const response = await fetch(
			`http://localhost:4000/v1/account/user/${userId}/check/${autopartIDs.join(',')}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		if (!response.ok) {
			throw new Error('Failed to check if items are in cart');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Failed to check if items are in cart:', error);
		return {};
	}
};

interface ItemFromBasket {
	cartItemID: number;
	token: string;
	userID: string;
}

export const handleRemoveFromCart = async ({
	cartItemID,
	token,
	userID
}: ItemFromBasket) => {
	try {
		const response = await fetch(
			`http://localhost:4000/v1/account/user/${userID}/remove_items/${cartItemID}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);
		if (!response.ok) {
			throw new Error('Failed to remove item');
		}
	} catch (error) {
		console.error('Failed to remove item from server', error);
	}
};

export const useFetchBrands = () => {
	const [brands, setBrands] = useState<Brand[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<Brand[]>(
					'http://localhost:4000/shop/brands'
				);
				setBrands(response.data);
			} catch (error) {
				console.error('Error fetching brands:', error);
			}
		};
		fetchData();
	}, []);
	return brands;
};

export const useFetchAllModelAuto = () => {
	const [models, setModels] = useState<ModelAuto[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<ModelAuto[]>(
					'http://localhost:4000/shop/modelautos'
				);
				setModels(response.data);
			} catch (error) {
				console.error('Error fetching models:', error);
			}
			fetchData();
		};
	}, []);
	return models;
};

export const useFetchModelAuto = ({ brandId }: { brandId: number }) => {
	const [modelAuto, setModelAuto] = useState<ModelAuto[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<ModelAuto[]>(
					`http://localhost:4000/shop/modelauto/${brandId}`
				);
				setModelAuto(response.data);
			} catch (error) {
				console.error('Failed to fetch modelAuto', error);
			}
		};

		fetchData();
	}, []);

	return modelAuto;
};

export const useFetchPartById = (id: number) => {
	const [part, setPart] = useState<AutoPart | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchPart = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get<AutoPart>(
					`http://localhost:4000/shop/auto-part/${id}`
				);
				const fetchedPart = response.data;
				setPart(fetchedPart);
			} catch (error) {
				setError('Error fetching in hooks');
			} finally {
				setIsLoading(false);
			}
		};

		fetchPart();
	}, [id]);

	return {
		part,
		error,
		isLoading
	};
};
