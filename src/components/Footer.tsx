import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Student Art Shop</h3>
            <p className="text-muted-foreground">
              Supporting student artists through customizable products
            </p>
          </div>
          
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-foreground">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Admin</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/admin/login" className="text-muted-foreground hover:text-foreground">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};