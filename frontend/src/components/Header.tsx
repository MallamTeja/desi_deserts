import { Link } from "react-router-dom";

const Header = () => (
  <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
    <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      <Link to="/" className="font-display text-xl font-bold text-primary">
        Desi Desserts
      </Link>
      <nav className="flex items-center gap-4">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;
