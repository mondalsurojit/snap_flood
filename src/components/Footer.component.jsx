import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Linkedin, AlertCircle } from "lucide-react";

function Footer() {
    const links = {
        Product: [
            { name: "Features", href: "#features" },
            { name: "How It Works", href: "#how-it-works" },
            { name: "Try on web", href: "#" },
        ],
        About: [
            { name: "Mission", href: "#mission" },
            { name: "RAFT", href: "https://sites.google.com/iith.ac.in/satishregonda/raft" },
            { name: "Prof. Satish", href: "https://sites.google.com/iith.ac.in/satishregonda/home" },
        ],
        More: [
            { name: "Help Center", href: "/help-center" },          // ✅ updated
            { name: "Privacy Policy", href: "/privacy-policy" },    // ✅ updated
            { name: "Sitemap", href: "#" },
        ],
    };

    const socialIcons = [
        { Icon: Twitter, name: "Twitter" },
        { Icon: Facebook, name: "Facebook" },
        { Icon: Instagram, name: "Instagram" },
        { Icon: Linkedin, name: "LinkedIn" },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">

                    {/* Brand Section */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">
                                SnapFlood
                            </span>
                        </div>

                        <p className="text-gray-400 mb-6 max-w-sm">
                            Stay safe and informed during flood events with real-time alerts and community support.
                        </p>

                        <div className="flex gap-4">
                            {socialIcons.map(({ Icon, name }) => (
                                <a
                                    key={name}
                                    href="#"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                                    aria-label={name}
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Sections */}
                    {Object.entries(links).map(([category, items]) => (
                        <div key={category}>
                            <h3 className="text-white font-semibold mb-4">
                                {category}
                            </h3>
                            <ul className="space-y-3">
                                {items.map((item) => (
                                    <li key={item.name}>
                                        {item.href.startsWith("http") ? (
                                            <a
                                                href={item.href}
                                                className="text-gray-400 hover:text-white transition-colors"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {item.name}
                                            </a>
                                        ) : item.href.startsWith("/") ? (
                                            <Link
                                                to={item.href}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <a
                                                href={item.href}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                {item.name}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-gray-800 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} SnapFlood. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
