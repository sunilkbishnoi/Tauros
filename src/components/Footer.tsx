
import { useState } from "react";
import { ContactDialog } from "./ContactDialog";
import { CompanyInfo } from "./footer/CompanyInfo";
import { QuickLinks } from "./footer/QuickLinks";
import { SocialLinks } from "./footer/SocialLinks";
import { FooterBottom } from "./footer/FooterBottom";

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <CompanyInfo onContactClick={() => setContactOpen(true)} />

          {/* Quick Links */}
          <QuickLinks onContactClick={() => setContactOpen(true)} />

          {/* Connect With Us */}
          <SocialLinks />
        </div>
        
        {/* Footer bottom section */}
        <FooterBottom />
      </div>

      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </footer>
  );
}
