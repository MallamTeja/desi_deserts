import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [desserts, setDesserts] = useState<any[]>([]);
  const [tab, setTab] = useState<"orders">("orders");

  useEffect(() => {
    // Check if already logged in from session
    const stored = sessionStorage.getItem("admin_logged_in");
    if (stored === "true") {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, dessertsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/desserts"),
      ]);
      const ordersData = await ordersRes.json();
      const dessertsData = await dessertsRes.json();
      if (Array.isArray(ordersData)) setOrders(ordersData);
      if (Array.isArray(dessertsData)) setDesserts(dessertsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setIsLoggedIn(true);
      sessionStorage.setItem("admin_logged_in", "true");
      fetchData();
    } catch (error: any) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_logged_in");
  };

  const updateOrder = async (id: string, field: string, value: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!response.ok) throw new Error("Update failed");
      toast({ title: "Updated!" });
      fetchData();
    } catch (error) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-sm mx-auto px-4 py-20">
          <h1 className="font-display text-2xl font-bold text-foreground mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="submit" disabled={authLoading} className="btn-order w-full">
              {authLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Panel</h1>
          <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground">
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setTab("orders")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === "orders" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {tab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 && <p className="text-muted-foreground text-center py-10">No orders yet.</p>}
            {orders.map((order) => (
              <div key={order._id} className="bg-card border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-primary text-lg">#{order.order_id}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> {order.name}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {order.phone}</div>
                  <div><span className="text-muted-foreground">Dessert:</span> {order.dessert_name}</div>
                  <div><span className="text-muted-foreground">Amount:</span> ₹{order.total_amount}</div>
                  <div><span className="text-muted-foreground">Txn ID:</span> {order.transaction_id}</div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Payment</label>
                    <select
                      value={order.transaction_status}
                      onChange={(e) => updateOrder(order._id, "transaction_status", e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Serving</label>
                    <select
                      value={order.serving_status}
                      onChange={(e) => updateOrder(order._id, "serving_status", e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="served">Served</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


      </div>
    </div>
  );
};

export default Admin;
