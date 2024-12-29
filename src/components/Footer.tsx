import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container mx-auto py-12">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-2">Subscribe to our newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Stay updated with new student artworks and exclusive offers
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1"
              />
              <Button type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">About SassiArt</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Supporting young artists by showcasing their work and helping them develop their creative journey.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/gallery" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Browse Gallery
                </Link>
              </li>
              <li>
                <Link 
                  to="/featured" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Featured Artists
                </Link>
              </li>
              <li>
                <Link 
                  to="/new" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Help</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/copyright" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Copyright Notice
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {new Date().getFullYear()} SassiArt. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <img 
                src="/payment-methods.png" 
                alt="Accepted payment methods" 
                className="h-6"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}