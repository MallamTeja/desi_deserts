import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getDessertImage } from "@/lib/dessert-images";
import { useCart } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/CheckoutForm";
import { toast } from "@/hooks/use-toast";

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, cartCount, updateQty, removeFromCart, clearCart } = useCart();
    const [submitting, setSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    if (orderId) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 container max-w-md mx-auto px-4 py-20 text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground">Order Placed!</h2>
                    <div className="bg-card border border-border rounded-xl p-6">
                        <p className="text-sm text-muted-foreground mb-1">Your Order ID</p>
                        <p className="font-display text-4xl font-bold text-primary tracking-wider">#{orderId}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Save this order ID. We'll verify your payment and prepare your desserts.
                    </p>
                    <button onClick={() => navigate("/")} className="btn-order">
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    if (cartCount === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <div className="text-center space-y-4">
                        <div className="text-6xl">🛒</div>
                        <h2 className="font-display text-2xl font-bold text-foreground">Your cart is empty</h2>
                        <p className="text-muted-foreground">Add some delicious desserts!</p>
                        <button onClick={() => navigate("/")} className="btn-order">Browse Desserts</button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const handleCheckout = async (data: { name: string; phone: string; transactionId: string }) => {
        setSubmitting(true);

        // Create one order per cart item
        let lastOrderId = "";
        for (const item of cartItems) {
            const { data: orderData, error } = await supabase
                .from("orders")
                .insert({
                    order_id: "",
                    name: data.name,
                    phone: data.phone,
                    dessert_id: item.id,
                    dessert_name: item.name,
                    quantity: item.quantity,
                    total_amount: item.price * item.quantity,
                    transaction_id: data.transactionId,
                })
                .select("order_id")
                .single();

            if (error) {
                toast({ title: "Order failed", description: error.message, variant: "destructive" });
                setSubmitting(false);
                return;
            }
            lastOrderId = orderData.order_id;
        }

        clearCart();
        setOrderId(lastOrderId);
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container max-w-2xl mx-auto px-4 py-8 space-y-6">
                {/* Back button */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue shopping
                </button>

                <h1 className="font-display text-2xl font-bold text-foreground">Your Cart</h1>

                {/* Cart Items */}
                <div className="space-y-3">
                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                            <img
                                src={getDessertImage(item.image_url)}
                                alt={item.name}
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-display font-semibold text-foreground truncate">{item.name}</h3>
                                <p className="text-sm text-primary font-display font-bold">₹{item.price}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => updateQty(item.id, item.quantity - 1)}
                                        className="w-7 h-7 rounded-md bg-secondary text-foreground flex items-center justify-center text-sm font-bold hover:bg-secondary/80 transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQty(item.id, item.quantity + 1)}
                                        className="w-7 h-7 rounded-md bg-secondary text-foreground flex items-center justify-center text-sm font-bold hover:bg-secondary/80 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-display font-bold text-foreground">₹{item.price * item.quantity}</p>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-xs text-destructive font-medium hover:underline mt-1"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                    <span className="font-display text-lg font-semibold text-foreground">Total</span>
                    <span className="font-display text-2xl font-bold text-primary">₹{cartTotal}</span>
                </div>

                {/* Checkout Form */}
                <CheckoutForm
                    totalAmount={cartTotal}
                    submitting={submitting}
                    onSubmit={handleCheckout}
                    buttonLabel={`Place Order (₹${cartTotal})`}
                />
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
