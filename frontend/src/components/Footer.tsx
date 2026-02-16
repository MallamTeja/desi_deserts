import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
    const contacts = [
        {
            name: "Rahul Sharma",
            role: "Head Chef",
            phone: "+91 98765 43210",
        },
        {
            name: "Priya Patel",
            role: "Event Manager",
            phone: "+91 98765 12345",
        },
        {
            name: "Amit Singh",
            role: "Customer Support",
            phone: "+91 98765 67890",
        },
    ];

    return (
        <footer className="bg-primary text-primary-foreground mt-6 py-4 border-t border-border/20">
            <div className="container max-w-5xl mx-auto px-4">
                {/* Contact Section */}
                <div className="text-center">
                    <h4 className="font-display text-base font-semibold mb-2 text-white">Contact Our Team</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {contacts.map((contact, index) => (
                            <div key={index} className="bg-primary-foreground/5 p-2 rounded-lg border border-white/20 hover:border-white/40 transition-colors text-center">
                                <p className="font-medium text-sm text-white">{contact.name}</p>
                                <p className="text-[10px] text-primary-foreground/60 uppercase tracking-wider mb-0.5">{contact.role}</p>
                                <div className="flex items-center justify-center gap-1.5 text-[10px] text-white">
                                    <Phone className="w-3 h-3" />
                                    <span>{contact.phone}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 text-center text-[10px] text-primary-foreground/60">
                    <p>&copy; {new Date().getFullYear()} Desi Desserts. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
