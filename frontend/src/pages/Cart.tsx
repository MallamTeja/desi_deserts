import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { getDessertImage } from "@/lib/dessert-images";
import { Trash2, Plus, Minus } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Cart = () => {
    const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState<string | null>(null);

    const handleCheckout = async (details: { name: string; phone: string; transactionId: string }) => {
        setLoading(true);

        try {
            const promises = items.map(item =>
                fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: details.name,
                        phone: details.phone,
                        dessert_id: item.id,
                        dessert_name: item.name,
                        quantity: item.quantity,
                        total_amount: item.price * item.quantity,
                        transaction_id: details.transactionId,
                    }),
                }).then(res => res.json())
            );

            const results = await Promise.all(promises);

            const firstOrderId = results[0]?.order_id;

            if (firstOrderId) {
                setOrderId(firstOrderId);
                clearCart();
                toast({ title: "Order Placed Successfully!" });
            } else {
                setOrderId("BATCH-" + Date.now());
                clearCart();
                toast({ title: "Order Placed Successfully!" });
            }

        } catch (error: any) {
            toast({ title: "Checkout Failed", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (orderId) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-grow container max-w-md mx-auto px-4 py-20 text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground">Order Placed!</h2>
                    <div className="bg-card border border-border rounded-xl p-6">
                        <p className="text-sm text-muted-foreground mb-1">Your Order Reference</p>
                        <p className="font-display text-xl md:text-2xl font-bold text-primary break-all">{orderId}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        We've received your order for {items.length > 0 ? items.length : "multiple"} items.
                    </p>
                    <button onClick={() => navigate("/")} className="btn-order">
                        Back to Menu
                    </button>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
                <h1 className="font-display text-3xl font-bold mb-8">Your Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
                        <button onClick={() => navigate("/")} className="btn-order">
                            Browse Desserts
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Cart Items */}
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-card border border-border">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                        <img
                                            src={getDessertImage(item.image_url)}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                            <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-destructive hover:text-destructive/80 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="font-semibold text-xl">Total</span>
                                <span className="font-bold text-2xl text-primary">₹{cartTotal}</span>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <div>
                            <div className="sticky top-24">
                                <h2 className="font-display text-2xl font-bold mb-6">Checkout</h2>
                                <CheckoutForm
                                    onSubmit={handleCheckout}
                                    loading={loading}
                                    totalAmount={cartTotal}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
