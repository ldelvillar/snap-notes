import Link from "next/link";
import PhoneIcon from "@/assets/Phone";
import EnvelopeIcon from "@/assets/Envelope";
import LinkedInIcon from "@/assets/logos/LinkedIn";
import InstagramIcon from "@/assets/logos/Instagram";
import ContactForm from "@/components/landing/ContactForm";
import { SITE_CONFIG } from "@/config/site";

export const metadata = {
  title: "Contact Us | Snap Notes",
  description:
    "Get in touch with the Snap Notes team for support, inquiries, or feedback. We're here to help!",
};

interface ContactMethod {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}

const contactMethods: ContactMethod[] = [
  {
    icon: PhoneIcon,
    label: "Teléfono",
    value: SITE_CONFIG.company.phone,
    href: `tel:${SITE_CONFIG.company.phone}`,
  },
  {
    icon: EnvelopeIcon,
    label: "Email",
    value: SITE_CONFIG.company.email,
    href: `mailto:${SITE_CONFIG.company.email}`,
  },
  {
    icon: LinkedInIcon,
    label: "LinkedIn",
    value: "SnapNotes",
    href: SITE_CONFIG.social.linkedin,
  },
  {
    icon: InstagramIcon,
    label: "Instagram",
    value: "@snapnotes",
    href: SITE_CONFIG.social.instagram,
  },
];

export default function ContactPage() {
  return (
    <section className="min-h-screen max-w-7xl mx-auto grid md:grid-cols-2 gap-12 pt-32 pb-24 px-4 md:px-6 animate-fade-in">
      <div className="text-gray-100">
        <h1 className="font-extrabold text-3xl md:text-4xl text-primary mb-6 drop-shadow-lg">
          Need some help? Get in touch!
        </h1>
        <p className="max-w-lg mb-6">
          If you have any questions, suggestions, or need assistance, feel free
          to contact us.
        </p>
        <p className="max-w-lg mb-6">
          Complete the contact form or reach out to us through any of the
          available channels and we will get back to you as soon as possible.
        </p>
        <div className="text-lg">
          {contactMethods.map((method, idx) => (
            <p className="flex items-center gap-2 mb-1.5" key={idx}>
              <method.icon className="size-6" />
              {method.href ? (
                <Link
                  href={method.href}
                  target="_blank"
                  className="hover:text-primary transition"
                >
                  {method.value}
                </Link>
              ) : (
                <span>{method.value}</span>
              )}
            </p>
          ))}
        </div>
      </div>

      <ContactForm />
    </section>
  );
}
