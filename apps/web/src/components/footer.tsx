import Link from "next/link";

const footerLinks = {
  Product: [
    { name: "Features", href: "/product" },
    { name: "Pricing", href: "/pricing" },
    { name: "Integrations", href: "/integrations" },
    { name: "Changelog", href: "/changelog" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  Resources: [
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/api" },
    { name: "Guides", href: "/guides" },
    { name: "Support", href: "/support" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Security", href: "/security" },
    { name: "GDPR", href: "/gdpr" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-dark-bg-primary text-dark-text-primary border-t border-border-gray/20">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-caption font-semibold mb-4 text-dark-text-secondary">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-body text-dark-text-primary/70 hover:text-accent-taupe transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border-gray/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-taupe to-accent-blue flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">A</span>
            </div>
            <span className="font-display font-semibold text-lg">Ayvlo</span>
          </div>

          <p className="text-small text-dark-text-primary/50">
            © 2025 Ayvlo Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
