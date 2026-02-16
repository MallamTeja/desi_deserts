import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import IntroAnimation from "@/components/IntroAnimation";
import DessertCard from "@/components/DessertCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [desserts, setDesserts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleIntroComplete = useCallback(() => setShowIntro(false), []);

  useEffect(() => {
    const fetchDesserts = async () => {
      const { data } = await supabase.from("desserts").select("*");
      if (data) setDesserts(data);
      setLoading(false);
    };
    fetchDesserts();
  }, []);

  const handleOrder = (dessert: any) => {
    navigate(`/desserts/${dessert.id}`);
  };

  if (showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-10 space-y-2">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Our Desserts
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            made with love. Limited batches daily.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-dessert animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-10 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {desserts.map((dessert) => (
              <DessertCard key={dessert.id} dessert={dessert} onOrder={handleOrder} />
            ))}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default Index;
