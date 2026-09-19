"use client";

import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, FormEvent } from "react";
import { PhoneInput } from "@/components/ui/phone-input";
import { toast } from "sonner";

export default function ScheduleVisitModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
  });

  const [touched, setTouched] = useState({
    fullName: false,
    phone: false,
    email: false,
    date: false,
    time: false,
  });

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return false;
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13;
  };

  const validateForm = (): boolean => {
    const newErrors = {
      fullName: "",
      phone: "",
      email: "",
      date: "",
      time: "",
    };

    // Full Name Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    // Phone Validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    // Email Validation (NOW COMPULSORY)
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Date Validation
    if (!formData.date) {
      newErrors.date = "Please select a visit date";
    }

    // Time Validation
    if (!formData.time) {
      newErrors.time = "Please select a visit time";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  const validateField = (field: keyof typeof formData) => {
    const newErrors = { ...errors };
    const value = formData[field];

    if (field === "fullName") {
      if (!value.trim()) newErrors.fullName = "Full name is required";
      else if (value.trim().length < 2)
        newErrors.fullName = "Name must be at least 2 characters";
      else newErrors.fullName = "";
    }

    if (field === "phone") {
      if (!value.trim()) newErrors.phone = "Phone number is required";
      else if (!validatePhone(value))
        newErrors.phone = "Enter a valid phone number";
      else newErrors.phone = "";
    }

    if (field === "email") {
      if (!value.trim()) newErrors.email = "Email address is required";
      else if (!validateEmail(value))
        newErrors.email = "Enter a valid email address";
      else newErrors.email = "";
    }

    if (field === "date") {
      newErrors.date = !value ? "Please select a visit date" : "";
    }

    if (field === "time") {
      newErrors.time = !value ? "Please select a visit time" : "";
    }

    setErrors(newErrors);
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Immediate validation feedback if field was already touched
    if (touched[field]) {
      validateField(field);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched to show errors
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      date: true,
      time: true,
    });

    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await fetch("/api/schedule-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to schedule visit");
        }

        toast.success("Site Visit Scheduled!", {
          description: "We'll contact you shortly to confirm your visit.",
          duration: 5000,
        });

        // Reset
        setFormData({ fullName: "", phone: "", email: "", date: "", time: "" });
        setTouched({
          fullName: false,
          phone: false,
          email: false,
          date: false,
          time: false,
        });
        onClose();
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error", {
          description:
            error instanceof Error
              ? error.message
              : "Failed to schedule visit.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl my-4"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
            >
              <X size={18} className="sm:w-5 sm:h-5 text-gray-700" />
            </button>

            <div className="grid lg:grid-cols-2">
              {/* LEFT SIDE - Static Content */}
              <div className="hidden lg:block relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
                <div className="absolute inset-0">
                  <Image
                    src="/images/optimized/EntryGate.webp"
                    alt="Site"
                    fill
                    className="object-cover opacity-40"
                  />
                </div>
                <div className="relative z-10">
                  <Image
                    src="/logo/Amor.png"
                    alt="Logo"
                    width={60}
                    height={10}
                    className="rounded-xl mb-6"
                  />
                  <h2 className="text-3xl font-bold mb-2.5">
                    Schedule Your Site Visit
                  </h2>
                  <div className="space-y-4 mt-8">
                    <Benefit
                      icon={<CheckCircle2 size={18} />}
                      text="Mandatory Details for Verification"
                    />
                    <Benefit
                      icon={<MapPin size={18} />}
                      text="Sarai Sheikh, Satrikh Road, Lucknow"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - FORM */}
              <div className="p-5 sm:p-6 lg:p-8 bg-gray-50">
                <div className="mb-4 sm:mb-5">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Book Your Visit
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    All fields are mandatory to confirm your booking.
                  </p>
                </div>

                <form className="space-y-3.5" onSubmit={handleSubmit}>
                  <InputField
                    icon={User}
                    placeholder="Full Name*"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleFieldChange("fullName", e.target.value)
                    }
                    onBlur={() => handleBlur("fullName")}
                    error={touched.fullName ? errors.fullName : ""}
                  />

                  <PhoneInput
                    placeholder="Mobile Number*"
                    defaultCountry="IN"
                    value={formData.phone}
                    onChange={(value) =>
                      handleFieldChange("phone", value || "")
                    }
                    onBlur={() => handleBlur("phone")}
                    className={`h-11 sm:h-12 text-xs sm:text-sm w-full rounded-lg bg-white  ${
                      touched.phone && errors.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-red-500 text-[10px] mt-1 ml-1">
                      {errors.phone}
                    </p>
                  )}

                  <InputField
                    icon={Mail}
                    placeholder="Email Address*"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    error={touched.email ? errors.email : ""}
                  />

                  <InputField
                    icon={Calendar}
                    placeholder="Select Date*"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFieldChange("date", e.target.value)}
                    onBlur={() => handleBlur("date")}
                    error={touched.date ? errors.date : ""}
                    min={today}
                  />

                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10 pointer-events-none" />
                    <select
                      value={formData.time}
                      onChange={(e) =>
                        handleFieldChange("time", e.target.value)
                      }
                      onBlur={() => handleBlur("time")}
                      className={`h-11 sm:h-12 text-xs sm:text-sm w-full rounded-lg bg-white border-2 ${
                        touched.time && errors.time
                          ? "border-red-500"
                          : "border-gray-300"
                      } pl-9 pr-3 text-gray-700 focus:border-[#c89b66] transition-all appearance-none`}
                    >
                      <option value="">Select Visit Time*</option>
                      <option value="09:00-10:00">09:00 AM - 10:00 AM</option>
                      <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
                      <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
                      <option value="12:00-13:00">12:00 PM - 01:00 PM</option>
                      <option value="14:00-15:00">02:00 PM - 03:00 PM</option>
                      <option value="15:00-16:00">03:00 PM - 04:00 PM</option>
                      <option value="16:00-17:00">04:00 PM - 05:00 PM</option>
                      <option value="17:00-18:00">05:00 PM - 06:00 PM</option>
                    </select>
                    {touched.time && errors.time && (
                      <p className="text-red-500 text-[10px] mt-1 ml-1">
                        {errors.time}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={!isLoading ? { scale: 1.01 } : {}}
                    whileTap={!isLoading ? { scale: 0.99 } : {}}
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-11 sm:h-12 rounded-lg bg-gradient-to-r from-[#c89b66] to-[#a8865c] text-white font-semibold flex items-center justify-center gap-2 ${
                      isLoading ? "opacity-70" : ""
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Confirm Site Visit"
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Reusable Components
function Benefit({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="shrink-0 text-white">{icon}</div>
      <p className="text-sm font-medium text-white/95">{text}</p>
    </div>
  );
}

function InputField({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  min,
}: {
  icon: any;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
  min?: string;
}) {
  return (
    <div className="flex-1">
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10 pointer-events-none" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          min={min}
          className={`h-11 sm:h-12 text-xs sm:text-sm w-full rounded-lg bg-white border-2 ${
            error ? "border-red-500" : "border-gray-300"
          } pl-9 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-[#c89b66] transition-all`}
        />
      </div>
      {error && <p className="text-red-500 text-[10px] mt-1 ml-1">{error}</p>}
    </div>
  );
}
