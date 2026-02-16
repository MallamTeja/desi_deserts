import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import CheckoutForm from "@/components/CheckoutForm";
import { toast } from "@/hooks/use-toast";
import { getDessertImage } from "@/lib/dessert-images";
import Footer from "@/components/Footer";

const Buy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dessert = location.state?.dessert;

    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    if (!dessert) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container max-w-md mx-auto px-4 py-20 text-center">
                    <p className="text-muted-foreground">No dessert selected.</p>
                    <button onClick={() => navigate("/")} className="btn-order mt-4">
                        Browse Desserts
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const handleCheckout = async (details: { name: string; phone: string; transactionId: string }) => {
        setLoading(true);

        const { data, error } = await supabase
            .from("orders")
            .insert({
                order_id: "",
                name: details.name,
                phone: details.phone,
                dessert_id: dessert.id,
                dessert_name: dessert.name,
                quantity: 1, // Direct buy is usually 1
                total_amount: dessert.price,
                transaction_id: details.transactionId,
            })
            .select("order_id")
            .single();

        setLoading(false);

        if (error) {
            toast({ title: "Order failed", description: error.message, variant: "destructive" });
            return;
        }

        setOrderId(data.order_id);
    };

    if (orderId) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container max-w-md mx-auto px-4 py-20 text-center space-y-6">
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
                        Save this order ID. We'll verify your payment and prepare your {dessert.name}.
                    </p>
                    <button onClick={() => navigate("/")} className="btn-order">
                        Back to Menu
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
                <h1 className="font-display text-2xl font-bold mb-8">Complete Your Purchase</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Item Summary */}
                    <div className="space-y-6">
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                            <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                    <img
                                        src={getDessertImage(dessert.image_url)}
                                        alt={dessert.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">{dessert.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: 1</p>
                                    <p className="font-bold text-primary mt-1">₹{dessert.price}</p>
                                </div>
                            </div>
                            <div className="border-t mt-4 pt-4 flex justify-between">
                                <span>Total Amount</span>
                                <span className="font-bold text-xl">₹{dessert.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div>
                        <CheckoutForm
                            onSubmit={handleCheckout}
                            loading={loading}
                            totalAmount={dessert.price}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Buy;
