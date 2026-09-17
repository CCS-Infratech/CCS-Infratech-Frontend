import axios from "axios";

export interface PublicSiteSettings {
  id: number;

  companyName: string | null;
  companyDescription: string | null;

  phone: string | null;
  phone2: string | null;

  email: string | null;
  email2: string | null;

  whatsapp: string | null;

  websiteUrl: string | null;

  address: string | null;

  registeredOffice: string | null;
  corporateOffice: string | null;

  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;

  logoUrl: string | null;
  faviconUrl: string | null;

  footerText: string | null;

  mapUrl: string | null;
  googleMapUrl: string | null;

  workingHours: string | null;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_CCS_BACKEND_URL ||
  "https://api.ccsinfratech.com";

const defaultSettings: PublicSiteSettings = {
  id: 1,

  companyName: null,
  companyDescription: null,

  phone: null,
  phone2: null,

  email: null,
  email2: null,

  whatsapp: null,

  websiteUrl: null,

  address: null,

  registeredOffice: null,
  corporateOffice: null,

  facebookUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
  linkedinUrl: null,
  twitterUrl: null,

  logoUrl: null,
  faviconUrl: null,

  footerText: null,

  mapUrl: null,
  googleMapUrl: null,

  workingHours: null
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/settings`,
      {
        timeout: 10000
      }
    );

    return response.data?.data || defaultSettings;
  } catch (error) {
    console.error("Failed to load website settings:", error);

    return defaultSettings;
  }
}
