import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getDessertImage } from "@/lib/dessert-images";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/CheckoutForm";
import { toast } from "@/hooks/use-toast";

const Buy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dessert = location.state?.dessert;

    const [submitting, setSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    if (!dessert) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <p className="text-muted-foreground mb-4">No dessert selected.</p>
                    <button onClick={() => navigate("/")} className="btn-order">Browse Desserts</button>
                </div>
            </div>
        );
    }

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
                        Save this order ID. We'll verify your payment and prepare your {dessert.name}.
                    </p>
                    <button onClick={() => navigate("/")} className="btn-order">
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (data: { name: string; phone: string; transactionId: string }) => {
        setSubmitting(true);
        const { data: orderData, error } = await supabase
            .from("orders")
            .insert({
                order_id: "",
                name: data.name,
                phone: data.phone,
                dessert_id: dessert.id,
                dessert_name: dessert.name,
                quantity: 1,
                total_amount: dessert.price,
                transaction_id: data.transactionId,
            })
            .select("order_id")
            .single();

        setSubmitting(false);

        if (error) {
            toast({ title: "Order failed", description: error.message, variant: "destructive" });
            return;
        }

        setOrderId(orderData.order_id);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container max-w-md mx-auto px-4 py-8 space-y-6">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Go back
                </button>

                <h1 className="font-display text-2xl font-bold text-foreground">Complete Purchase</h1>

                {/* Item Summary Card */}
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                    <img
                        src={getDessertImage(dessert.image_url)}
                        alt={dessert.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                        <h3 className="font-display font-semibold text-foreground">{dessert.name}</h3>
                        <p className="text-sm text-muted-foreground">Qty: 1</p>
                    </div>
                    <p className="font-display text-xl font-bold text-primary">₹{dessert.price}</p>
                </div>

                {/* Checkout form */}
                <CheckoutForm
                    totalAmount={dessert.price}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                    buttonLabel={`Pay ₹${dessert.price}`}
                />
            </main>
            <Footer />
        </div>
    );
};

export default Buy;
