import Link from 'next/link';
import PhoneIcon from '@/assets/Phone';
import EnvelopeIcon from '@/assets/Envelope';
import LinkedInIcon from '@/assets/logos/LinkedIn';
import InstagramIcon from '@/assets/logos/Instagram';
import ContactForm from '@/components/landing/ContactForm';
import { SITE_CONFIG } from '@/config/site';

export const metadata = {
  title: 'Contact Us | Snap Notes',
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
    label: 'Teléfono',
    value: SITE_CONFIG.company.phone,
    href: `tel:${SITE_CONFIG.company.phone}`,
  },
  {
    icon: EnvelopeIcon,
    label: 'Email',
    value: SITE_CONFIG.company.email,
    href: `mailto:${SITE_CONFIG.company.email}`,
  },
  {
    icon: LinkedInIcon,
    label: 'LinkedIn',
    value: 'SnapNotes',
    href: SITE_CONFIG.social.linkedin,
  },
  {
    icon: InstagramIcon,
    label: 'Instagram',
    value: '@snapnotes',
    href: SITE_CONFIG.social.instagram,
  },
];

export default function ContactPage() {
  return (
    <section className="animate-fade-in mx-auto grid min-h-screen max-w-7xl gap-12 px-4 pt-32 pb-24 md:grid-cols-2 md:px-6">
      <div className="text-gray-100">
        <h1 className="mb-6 text-3xl font-extrabold text-primary drop-shadow-lg md:text-4xl">
          Need some help? Get in touch!
        </h1>
        <p className="mb-6 max-w-lg">
          If you have any questions, suggestions, or need assistance, feel free
          to contact us.
        </p>
        <p className="mb-6 max-w-lg">
          Complete the contact form or reach out to us through any of the
          available channels and we will get back to you as soon as possible.
        </p>
        <div className="text-lg">
          {contactMethods.map((method, idx) => (
            <p className="mb-1.5 flex items-center gap-2" key={idx}>
              <method.icon className="size-6" />
              {method.href ? (
                <Link
                  href={method.href}
                  target="_blank"
                  className="transition hover:text-primary"
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
