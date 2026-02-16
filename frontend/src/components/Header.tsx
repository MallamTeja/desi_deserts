import { Link } from "react-router-dom";

const Header = () => (
  <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg border-b border-yellow-500/20">
    <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      <Link to="/" className="font-display text-2xl font-bold text-white hover:text-white/90 transition-colors">
        Desi Desserts
      </Link>
      <nav className="flex items-center gap-6">
        <Link to="/" className="text-sm font-medium text-primary-foreground/80 hover:text-yellow-500 transition-colors">
          Home
        </Link>
        <Link to="/admin" className="text-sm font-medium text-primary-foreground/80 hover:text-yellow-500 transition-colors">
          Admin
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;
