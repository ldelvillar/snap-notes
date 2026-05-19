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
    label: 'Phone',
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
    <div className="text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-36 pb-16 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]"
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="mb-4 text-sm font-semibold tracking-widest text-primary uppercase">
            Contact
          </p>
          <h1 className="mb-5 text-5xl font-bold md:text-6xl">Get in touch</h1>
          <p className="text-lg text-white/55">
            Have a question, suggestion, or need help? We&apos;d love to hear
            from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="animate-fade-in px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          {/* Left — info */}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
              Reach us
            </p>
            <h2 className="mb-3 text-2xl font-bold">We&apos;re here to help</h2>
            <p className="mb-8 text-white/55">
              Complete the form or reach out through any of the channels below.
              We typically respond within 48 business hours.
            </p>

            <div className="space-y-3">
              {contactMethods.map((method, idx) => {
                const content = (
                  <>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <method.icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium tracking-wider text-white/40 uppercase">
                        {method.label}
                      </p>
                      <p className="text-sm font-medium text-white/80 transition-colors group-hover:text-primary">
                        {method.value}
                      </p>
                    </div>
                  </>
                );

                return method.href ? (
                  <Link
                    key={idx}
                    href={method.href}
                    target="_blank"
                    className="group flex items-center gap-4 rounded-xl border border-white/8 bg-white/3 px-5 py-4 transition-all hover:border-primary/30 hover:bg-white/5"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={idx}
                    className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/3 px-5 py-4"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — form */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
