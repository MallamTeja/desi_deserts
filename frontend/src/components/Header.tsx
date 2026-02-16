import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

const Header = () => {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg border-b border-yellow-500/20">
      <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold text-white hover:text-white/90 transition-colors">
          Desi Desserts
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-primary-foreground/80 hover:text-yellow-500 transition-colors">
            Home
          </Link>
          <Link to="/cart" className="relative text-sm font-medium text-primary-foreground/80 hover:text-yellow-500 transition-colors flex items-center gap-2">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
