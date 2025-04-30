
import { Link } from "react-router-dom";

interface QuickLinksProps {
  onContactClick: () => void;
}

export function QuickLinks({ onContactClick }: QuickLinksProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
      <ul className="space-y-3">
        <li>
          <Link to="/markets" className="text-muted-foreground hover:text-foreground transition-colors">
            Markets
          </Link>
        </li>
        <li>
          <Link to="/news" className="text-muted-foreground hover:text-foreground transition-colors">
            News
          </Link>
        </li>
        <li>
          <Link to="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
            Portfolio
          </Link>
        </li>
        <li>
          <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
            Login/Sign Up
          </Link>
        </li>
        <li>
          <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
        </li>
        <li>
          <button 
            onClick={onContactClick} 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact Us
          </button>
        </li>
      </ul>
    </div>
  );
}
