import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";

const UPI_ID = "yourupi@bank";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dessert = location.state?.dessert;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
      </div>
    );
  }

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast({ title: "UPI ID copied!" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !transactionId.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      toast({ title: "Enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_id: "",
        name: name.trim(),
        phone: phone.trim(),
        dessert_id: dessert.id,
        dessert_name: dessert.name,
        quantity: 1,
        total_amount: dessert.price,
        transaction_id: transactionId.trim(),
      })
      .select("order_id")
      .single();

    setSubmitting(false);

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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-md mx-auto px-4 py-8 space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Complete Payment</h1>

        {/* Order Summary */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="font-display font-semibold text-foreground">{dessert.name}</p>
            <p className="text-sm text-muted-foreground">Qty: 1</p>
          </div>
          <p className="font-display text-xl font-bold text-primary">₹{dessert.price}</p>
        </div>

        {/* UPI Payment */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 text-center">
          <h2 className="font-display text-lg font-semibold text-foreground">Pay via UPI</h2>
          
          {/* QR placeholder */}
          <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <span className="text-xs text-muted-foreground">UPI QR Code</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <code className="bg-secondary px-3 py-1.5 rounded text-sm font-mono text-foreground">
              {UPI_ID}
            </code>
            <button
              onClick={handleCopyUPI}
              className="text-xs text-primary font-medium hover:underline"
            >
              Copy
            </button>
          </div>

          <div className="text-left text-sm text-muted-foreground space-y-1">
            <p>1. Open any UPI app (GPay, PhonePe, Paytm)</p>
            <p>2. Scan QR or pay to UPI ID above</p>
            <p>3. Pay <strong className="text-foreground">₹{dessert.price}</strong></p>
            <p>4. Enter the transaction ID below</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit phone number"
              maxLength={10}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Transaction ID</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter UPI transaction ID"
              maxLength={50}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-order w-full">
            {submitting ? "Submitting..." : "Submit Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
