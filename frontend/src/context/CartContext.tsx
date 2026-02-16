import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface CartItem {
    id: string; // dessert.id
    name: string;
    price: number;
    image_url: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: any) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (dessert: any) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === dessert.id);
            if (existing) {
                toast({
                    title: "Added another to cart",
                    description: `${dessert.name} quantity updated.`,
                });
                return prev.map((i) =>
                    i.id === dessert.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            toast({
                title: "Added to cart",
                description: `${dessert.name} added to your cart.`,
            });
            return [
                ...prev,
                {
                    id: dessert.id,
                    name: dessert.name,
                    price: dessert.price,
                    image_url: dessert.image_url,
                    quantity: 1,
                },
            ];
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
        toast({
            title: "Removed from cart",
            description: "Item removed from your cart.",
        });
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
