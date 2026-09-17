"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowUpRight, Phone, MailCheck, LocateIcon } from "lucide-react";
import { cloneElement } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib";
import {
  getPublicSiteSettings,
  PublicSiteSettings,
} from "@/lib/site-settings";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number",
  }),
  project: z.string().min(1, {
    message: "Please select a project",
  }),
  type: z.string().min(1, {
    message: "Please select a project type",
  }),
  investment: z.string().min(1, {
    message: "Please select an investment range",
  }),
});

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [siteSettings, setSiteSettings] =
    useState<PublicSiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getPublicSiteSettings();
      setSiteSettings(data);
    };

    loadSettings();
  }, []);

  const phone =
    siteSettings?.phone || "+(91) 70818-85577";

  const email =
    siteSettings?.email || "info@ccsinfratech.com";

  const address =
    siteSettings?.address ||
    "Sarai Sheikh, Satrikh Road, Chinhat, Lucknow, UP - 226010";

  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const emailHref = `mailto:${email}`;

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-12 lg:py-20 lg:mt-11">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20 xl:gap-28">

          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-start"
          >
            <div className="mb-6 sm:mb-8 lg:mb-10">
              <span className="inline-block border-2 border-amber-400 text-amber-600 text-[10px] sm:text-xs font-bold px-4 sm:px-6 lg:px-7 py-2 sm:py-2.5 rounded-full tracking-wider">
                QUICK ENQUIRY
              </span>
            </div>

            <div className="mb-8 sm:mb-10 lg:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[0.95] mb-8 sm:mb-10 lg:mb-12">
                We'd love to <br /> hear from you
              </h1>

              <ContactDetail
                icon={<Phone />}
                label="Phone number"
                value={phone}
                href={phoneHref}
              />

              <ContactDetail
                icon={<MailCheck />}
                label="Email address"
                value={email}
                href={emailHref}
              />

              <ContactDetail
                icon={<LocateIcon />}
                label="Office address"
                value={
                  <span className="whitespace-pre-line">
                    {address}
                  </span>
                }
                href={
                  siteSettings?.mapUrl ||
                  siteSettings?.googleMapUrl ||
                  "#"
                }
              />
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug mb-8">
              We'd love to share more with you, please complete this form and
              our team will get back shortly.
            </h2>

            <ContactForm
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactForm({
  isSubmitting,
  setIsSubmitting,
}: {
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      project: "amor",
      type: "",
      investment: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "/api/contact-us",
        values
      );

      toast.success("Enquiry Submitted!", {
        description:
          "We'll contact you within 24 hours.",
        duration: 5000,
      });

      form.reset({
        name: "",
        email: "",
        phone: "",
        project: "amor",
        type: "",
        investment: "",
      });
    } catch (error) {
      console.error(
        "Error submitting enquiry:",
        error
      );

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error ||
          "Failed to submit enquiry";

        toast.error("Submission Failed", {
          description: errorMessage,
          duration: 6000,
        });
      } else {
        toast.error("Submission Failed", {
          description:
            "Please try again or call us directly.",
          duration: 6000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonInputClass =
    "bg-gray-100 border-0 rounded-2xl px-4 py-6 text-gray-900 focus-visible:ring-2 focus-visible:ring-amber-400 h-auto text-sm sm:text-base";

  const selectItemClass =
    "text-black focus:bg-black focus:text-white cursor-pointer transition-colors";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 font-sans sm:space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Your Name*"
                    className={commonInputClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email*"
                    type="email"
                    className={commonInputClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormControl>
                  <PhoneInput
                    placeholder="Mobile Number*"
                    defaultCountry="IN"
                    value={field.value as any}
                    onChange={field.onChange}
                    className={cn(
                      "h-11 sm:h-14 text-sm w-full rounded-2xl mt-4 border-none transition-all px-1",
                      form.formState.errors.phone
                        ? "ring-2 ring-red-500"
                        : ""
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        commonInputClass,
                        "text-sm"
                      )}
                    >
                      <SelectValue placeholder="Select Project..." />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="bg-white border-gray-200 shadow-xl">
                    <SelectItem
                      value="amor"
                      className={selectItemClass}
                    >
                      Amor
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        commonInputClass,
                        "text-sm"
                      )}
                    >
                      <SelectValue placeholder="Project Type..." />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="bg-white border-gray-200 shadow-xl">
                    <SelectItem
                      value="plot"
                      className={selectItemClass}
                    >
                      Plot
                    </SelectItem>

                    <SelectItem
                      value="villas"
                      className={selectItemClass}
                    >
                      Villas
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investment"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        commonInputClass,
                        "text-sm text-black"
                      )}
                    >
                      <SelectValue placeholder="Investment Budget..." />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="bg-white border-gray-200 shadow-xl font-sans">
                    {[
                      {
                        value: "upto-75",
                        label: "Up to ₹75 Lacs",
                      },
                      {
                        value: "75-100",
                        label: "₹75L - ₹1 Cr",
                      },
                      {
                        value: "100-150",
                        label: "₹1 - 1.5 Cr",
                      },
                      {
                        value: "150-plus",
                        label: "₹1.5 Cr+",
                      },
                    ].map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="text-sm text-black cursor-pointer transition-colors data-[highlighted]:bg-black data-[highlighted]:text-white data-[highlighted]:outline-none"
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-2">
          <p className="text-gray-700 font-sans text-xs sm:text-sm font-medium">
            We're excited to connect!
          </p>

          <p className="text-gray-400 text-[10px] mt-1">
            Required fields are marked *
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#e1d18a] text-black font-bold px-10 py-6 rounded-full group h-auto w-full sm:w-auto flex items-center gap-2 shadow-lg hover:bg-amber-300 transition-all"
          >
            {isSubmitting
              ? "Sending..."
              : "Get A Call Back"}

            {!isSubmitting && (
              <div className="bg-white rounded-full p-1">
                <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function ContactDetail({
  icon,
  label,
  value,
  href,
}: {
  icon: any;
  label: string;
  value: any;
  href: string;
}) {
  return (
    <div className="flex items-start sm:items-center gap-4 mb-8">
      <div className="w-14 h-14 sm:w-20 sm:h-20 bg-[#e1d18a] rounded-full flex items-center justify-center flex-shrink-0">
        {cloneElement(icon, {
          className:
            "w-6 h-6 sm:w-8 sm:h-8 text-gray-900",
        })}
      </div>

      <div>
        <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">
          {label}
        </p>

        <a
          href={href}
          className="text-lg sm:text-2xl font-bold text-gray-900 hover:text-amber-600 transition-colors block leading-tight"
        >
          {value}
        </a>
      </div>
    </div>
  );
}
