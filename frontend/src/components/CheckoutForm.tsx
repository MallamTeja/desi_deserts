import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const UPI_ID = "yourupi@bank"; // This should ideally be an env var or prop

interface CheckoutData {
    name: string;
    phone: string;
    transactionId: string;
}

interface CheckoutFormProps {
    totalAmount: number;
    loading?: boolean;
    submitting?: boolean; // keeping for backward compatibility if needed, but 'loading' is better
    onSubmit: (data: CheckoutData) => void;
    buttonLabel?: string;
}

const CheckoutForm = ({ totalAmount, loading, submitting, onSubmit, buttonLabel = "Place Order" }: CheckoutFormProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [transactionId, setTransactionId] = useState("");

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(UPI_ID);
        toast({ title: "UPI ID copied!" });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim() || !transactionId.trim()) {
            toast({ title: "Please fill all fields", variant: "destructive" });
            return;
        }
        if (!/^\d{10}$/.test(phone.trim())) {
            toast({ title: "Enter a valid 10-digit phone number", variant: "destructive" });
            return;
        }
        onSubmit({ name: name.trim(), phone: phone.trim(), transactionId: transactionId.trim() });
    };

    const isLoading = loading || submitting;

    return (
        <div className="space-y-6">
            {/* UPI Payment Section */}
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
                        type="button"
                    >
                        Copy
                    </button>
                </div>

                <div className="text-left text-sm text-muted-foreground space-y-1">
                    <p>1. Open any UPI app (GPay, PhonePe, Paytm)</p>
                    <p>2. Scan QR or pay to UPI ID above</p>
                    <p>3. Pay <strong className="text-foreground">₹{totalAmount}</strong></p>
                    <p>4. Enter the transaction ID below</p>
                </div>
            </div>

            {/* Form Section */}
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
                        required
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
                        required
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
                <button type="submit" disabled={isLoading} className="btn-order w-full">
                    {isLoading ? "Processing..." : buttonLabel}
                </button>
            </form>
        </div>
    );
};

export default CheckoutForm;
