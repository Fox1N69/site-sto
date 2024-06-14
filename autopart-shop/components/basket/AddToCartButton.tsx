"use client";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { useSession } from "next-auth/react";

interface AddToCartButtonProps {
  autopartID: number;
  quantity: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  autopartID,
  quantity,
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:4000/v1/account/user/${session?.user.id}/basket/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({
            autopart_id: 7,
            quantity: quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }
      // Handle successful response if needed
    } catch (error) {
      setError("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onPress={handleAddToCart} disabled={isLoading}>
        {isLoading ? "Adding..." : "Add to Cart"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AddToCartButton;
