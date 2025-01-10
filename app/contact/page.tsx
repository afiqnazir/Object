"use client";

import { useState } from "react";
import { Menu, X, Send } from "lucide-react";

export default function Contact() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitMessage(
        "Thank you for your message! We will get back to you soon.",
      );
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitError("Failed to send message. Please try again later.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-gray-300">
      {/* Navigation Header */}
      <nav className="bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="/" className="text-white font-bold text-xl">
                OI
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a
                href="/about"
                className="text-white hover:text-gray-200 transition-colors"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="/about"
                  className="block text-white hover:bg-white/10 rounded-md px-3 py-2 transition-colors"
                >
                  About
                </a>
                <a
                  href="/contact"
                  className="block text-white hover:bg-white/10 rounded-md px-3 py-2 transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="p-4">
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

              {submitMessage && (
                <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
                  {submitMessage}
                </div>
              )}

              {submitError && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                  {submitError}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
