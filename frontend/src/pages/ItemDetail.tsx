import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getDessertImage } from "@/lib/dessert-images";
import { useCart } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const INGREDIENTS: Record<string, string[]> = {
    basundi: ["Full-fat Milk", "Sugar", "Cardamom", "Saffron", "Pistachios", "Almonds"],
    "kaddu-ki-kheer": ["Pumpkin (Kaddu)", "Milk", "Sugar", "Cardamom", "Ghee", "Dry Fruits"],
    "double-ka-meetha": ["Bread Slices", "Milk", "Sugar", "Cardamom", "Ghee", "Saffron", "Almonds", "Raisins"],
    // fallback keys
    khaddukakheer: ["Pumpkin (Kaddu)", "Milk", "Sugar", "Cardamom", "Ghee", "Dry Fruits"],
    "double-kameta": ["Bread Slices", "Milk", "Sugar", "Cardamom", "Ghee", "Saffron", "Almonds", "Raisins"],
};

const ItemDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [dessert, setDessert] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDessert = async () => {
            if (!id) return;
            const { data } = await supabase.from("desserts").select("*").eq("id", id).single();
            if (data) setDessert(data);
            setLoading(false);
        };
        fetchDessert();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse space-y-4 w-full max-w-md px-4">
                        <div className="aspect-square bg-muted rounded-2xl" />
                        <div className="h-6 bg-muted rounded w-2/3" />
                        <div className="h-4 bg-muted rounded w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!dessert) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <p className="text-muted-foreground mb-4">Dessert not found.</p>
                    <button onClick={() => navigate("/")} className="btn-order">Browse Desserts</button>
                </div>
            </div>
        );
    }

    const ingredients = INGREDIENTS[dessert.image_url] || [];

    const handleAddToCart = () => {
        addToCart({
            id: dessert.id,
            name: dessert.name,
            description: dessert.description,
            price: dessert.price,
            image_url: dessert.image_url,
        });
        toast({ title: `${dessert.name} added to cart!` });
    };

    const handleBuyNow = () => {
        navigate("/buy", { state: { dessert } });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
                {/* Back button */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to menu
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Image */}
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={getDessertImage(dessert.image_url)}
                            alt={dessert.name}
                            className="w-full aspect-square object-cover"
                        />
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="font-display text-3xl font-bold text-foreground">{dessert.name}</h1>
                            <p className="font-display text-2xl font-bold text-primary mt-2">₹{dessert.price}</p>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">{dessert.description}</p>

                        {/* Ingredients */}
                        {ingredients.length > 0 && (
                            <div>
                                <h3 className="font-display text-lg font-semibold text-foreground mb-3">Ingredients</h3>
                                <div className="flex flex-wrap gap-2">
                                    {ingredients.map((ing) => (
                                        <span
                                            key={ing}
                                            className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-full"
                                        >
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button onClick={handleAddToCart} className="flex-1 btn-order bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                    </svg>
                                    Add to Cart
                                </span>
                            </button>
                            <button onClick={handleBuyNow} className="flex-1 btn-order">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ItemDetail;
