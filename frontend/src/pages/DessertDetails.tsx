import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getDessertImage } from "@/lib/dessert-images";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { ArrowLeft } from "lucide-react";

const DessertDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [dessert, setDessert] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDessert = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from("desserts")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching dessert", error);
                navigate("/404");
            } else {
                setDessert(data);
            }
            setLoading(false);
        };

        fetchDessert();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!dessert) return null;

    const handleBuyNow = () => {
        // Navigate to buy page with just this item
        navigate("/buy", { state: { dessert } });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Menu
                </button>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section */}
                    <div className="rounded-xl overflow-hidden aspect-square md:aspect-auto h-full max-h-[500px]">
                        <img
                            src={getDessertImage(dessert.image_url)}
                            alt={dessert.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="font-display text-4xl font-bold text-foreground mb-2">{dessert.name}</h1>
                            <p className="text-2xl font-bold text-primary">₹{dessert.price}</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Description</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {dessert.description}
                            </p>
                        </div>

                        {/* Ingredients placeholder if we had them in DB, for now static or omitted */}

                        <div className="pt-6 space-y-4">
                            <button
                                onClick={() => addToCart(dessert)}
                                className="w-full py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary/10 transition-colors"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="btn-order w-full"
                            >
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

export default DessertDetails;
