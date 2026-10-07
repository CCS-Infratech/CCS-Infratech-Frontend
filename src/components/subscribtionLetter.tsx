"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClubTowersModal from "./quote-dialog";

export default function SubscriptionLetter() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <section className="w-full flex items-center justify-center ">
        <div className="w-full max-w-full bg-black rounded-3xl py-24 px-6 md:px-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e1d18a]/20 rounded-full blur-[100px] -z-0"></div>

          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e1d18a]/20 rounded-full blur-[100px] -z-0"></div>

          <h1 className="text-4xl p-4 md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent relative z-10">
            Put forth your enquiry
          </h1>

          <h2 className="text-2xl md:text-4xl font-medium text-[#e1d18a] mb-6 relative z-10">
            Own your dreams with us
          </h2>

          <div className="max-w-2xl mx-auto relative z-10">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="h-12 bg-black border border-gray-700 text-gray-200"
            />
          </div>

          <Button
            type="button"
            onClick={() => setIsQuoteDialogOpen(true)}
            className="h-12 mt-8 cursor-pointer px-10 text-md font-medium bg-gradient-to-r from-[#e1d18a] to-[#c4b678] hover:from-[#d9c983] hover:to-[#b8aa6d] transition-all duration-300 rounded-full text-gray-900"
          >
            Submit Enquiry
          </Button>

          <p className="text-sm font-sans text-gray-500 mt-4">
            By submitting this form, you agree to our Privacy Policy and Terms
            of Service.
          </p>
        </div>
      </section>

      <ClubTowersModal
        open={isQuoteDialogOpen}
        onClose={() => setIsQuoteDialogOpen(false)}
      />
    </>
  );
}
