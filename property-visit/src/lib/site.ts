// Company contact details (placeholders until the owner provides real ones).
export const SITE = {
  name: "PROPERTY VISIT",
  tagline: "Find Your Dream Property.",
  phoneDisplay: "+92 300 1234567",
  phone: "923001234567",
  email: "info@propertyvisit.pk",
  address: "Office 12, Gulberg III, Lahore, Pakistan",
  hours: "Mon – Sat, 9:00 AM – 7:00 PM",
  socials: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
    youtube: "https://www.youtube.com/",
  },
};

export function whatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
