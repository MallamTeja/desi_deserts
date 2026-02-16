import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import type { Session } from "@supabase/supabase-js";

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [desserts, setDesserts] = useState<any[]>([]);
  const [tab, setTab] = useState<"orders">("orders");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkAdmin(session.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkAdmin(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
    setLoading(false);
    if (data) {
      fetchData();
    }
  };

  const fetchData = async () => {
    const [ordersRes, dessertsRes] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("desserts").select("*"),
    ]);
    if (ordersRes.data) setOrders(ordersRes.data);
    if (dessertsRes.data) setDesserts(dessertsRes.data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  const updateOrder = async (id: string, field: string, value: string) => {
    const { error } = await supabase.from("orders").update({ [field]: value }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", variant: "destructive" });
    } else {
      toast({ title: "Updated!" });
      fetchData();
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-md mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">You don't have admin access.</p>
          <button onClick={handleLogout} className="btn-order mt-4">
            Sign Out
          </button>
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
              <div key={order.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
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
                      onChange={(e) => updateOrder(order.id, "transaction_status", e.target.value)}
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
                      onChange={(e) => updateOrder(order.id, "serving_status", e.target.value)}
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
