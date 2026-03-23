import Link from 'next/link';
import { SITE_CONFIG } from '@/config/site';

export const metadata = {
  title: 'Terms of Service | SnapNotes',
  description: 'Read the Terms of Service for using Snap Notes.',
};

export default function TermsOfServicePage() {
  return (
    <section className="animate-fade-in mx-auto max-w-4xl px-4 pt-32 pb-16 text-white">
      <h1 className="mb-6 text-5xl font-bold">Terms of Service</h1>
      <p className="mb-8 text-lg text-[#b09eb8]">
        Welcome to Snap Notes. By accessing and using our application, creating
        notes, storing data, or subscribing to our services, you accept the
        following terms and conditions. We recommend reading them carefully
        before using our note-taking platform.
      </p>

      <h2 className="mt-12 mb-4 text-3xl font-bold">
        1. Service Overview and Nature
      </h2>
      <p className="mb-4 text-[#b09eb8]">
        Snap Notes is a digital note-taking application designed to help you
        capture, organize, store, and manage your thoughts, ideas, notes, and
        information efficiently. We provide cloud storage, synchronization
        across devices, and organizational tools to enhance your productivity.
      </p>
      <p className="mb-4 text-[#b09eb8]">
        <strong>Important:</strong> Snap Notes is a service platform. We provide
        the infrastructure and tools for you to create and manage your notes.
        The content you create is your responsibility, and we act as custodians
        of your data according to our privacy policy.
      </p>

      <h2 className="mt-12 mb-4 text-3xl font-bold">
        2. User Responsibilities and Usage Guidelines
      </h2>
      <ul className="mb-4 list-disc space-y-2 pl-6 text-[#b09eb8]">
        <li>
          Users commit to using Snap Notes in compliance with all applicable
          laws and regulations.
        </li>
        <li>
          You may not use our service for illegal activities, harassment,
          malware distribution, or any harmful purpose.
        </li>
        <li>
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities under your account.
        </li>
        <li>
          You agree not to reverse engineer, decompile, or attempt to access the
          source code of our application.
        </li>
        <li>
          You may not attempt to circumvent security measures, exceed rate
          limits, or disrupt the service for other users.
        </li>
        <li>
          Storage limits, features, and availability may change without prior
          notice as we update the service.
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-3xl font-bold">
        3. Intellectual Property Rights
      </h2>
      <p className="mb-4 text-[#b09eb8]">
        All content, designs, code, logos, templates, and materials present in
        the Snap Notes application and website are the property of Snap Notes or
        its respective rights holders and are protected by applicable
        intellectual property laws worldwide.
      </p>
      <p className="mb-4 text-[#b09eb8]">
        The notes and content you create within Snap Notes remain your
        intellectual property. However, you grant Snap Notes a license to store,
        process, and display your content to provide the service. You retain all
        rights to your notes and can export or delete them at any time.
      </p>
      <p className="mb-4 text-[#b09eb8]">
        Reproduction, distribution, or commercial use of Snap Notes materials
        without express written permission is prohibited.
      </p>

      <h2 className="mt-12 mb-4 text-3xl font-bold">
        4. Account Creation and Service Activation
      </h2>
      <ul className="mb-4 list-disc space-y-2 pl-6 text-[#b09eb8]">
        <li>
          <strong>Registration:</strong> Create an account providing accurate
          personal information (name, email, password).
        </li>
        <li>
          <strong>Account Verification:</strong> Verify your email address to
          activate your account and access all features.
        </li>
        <li>
          <strong>Plan Selection:</strong> Choose a plan (Free, Pro, or Team)
          based on your needs and storage requirements.
        </li>
        <li>
          <strong>Payment:</strong> Subscription fees are billed monthly or
          annually according to your selected plan and payment method.
        </li>
        <li>
          <strong>Subscription Management:</strong> Manage, upgrade, downgrade,
          or cancel your subscription through your account settings.
        </li>
      </ul>
      <p className="mb-4 text-[#b09eb8]">
        <strong>Important:</strong> Free plan accounts have storage and feature
        limitations. Exceeding storage limits may require upgrading to a paid
        plan.
      </p>

      <h2 className="mt-12 mb-4 text-3xl font-bold">
        5. Limitation of Liability and Service Disclaimer
      </h2>

      <h3 className="mt-8 mb-3 text-2xl font-semibold">
        5.1. Snap Notes Liability
      </h3>
      <ul className="mb-4 list-disc space-y-2 pl-6 text-[#b09eb8]">
        <li>
          We are responsible for maintaining application availability, security
          measures, and professional service standards.
        </li>
        <li>
          We maintain appropriate security protocols and regular backups of user
          data.
        </li>
        <li>
          We provide technical support and address service issues according to
          our support SLA.
        </li>
      </ul>

      <h3 className="mt-8 mb-3 text-2xl font-semibold">
        5.2. Limitation of Liability
      </h3>
      <ul className="mb-4 list-disc space-y-2 pl-6 text-[#b09eb8]">
        <li>
          <strong>Service Availability:</strong> While we strive for 99.9%
          uptime, we do not guarantee uninterrupted service. Snap Notes is
          provided &quot;as is&quot; without warranties of any kind.
        </li>
        <li>
          <strong>Data Loss:</strong> Although we maintain backups, we are not
          responsible for data loss resulting from user error, unauthorized
          access, or circumstances beyond our control.
        </li>
        <li>
          <strong>Force Majeure:</strong> We are not liable for service
          interruptions due to natural disasters, cyber attacks, server
          failures, or circumstances beyond reasonable control.
        </li>
        <li>
          <strong>User Content:</strong> You are solely responsible for the
          content you create and store. We do not moderate or verify user notes.
        </li>
        <li>
          <strong>Third-Party Services:</strong> Snap Notes may integrate with
          third-party services. We are not responsible for their availability or
          performance.
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-3xl font-bold">
        6. Cancellation and Modification Policy
      </h2>
      <ul className="mb-4 list-disc space-y-2 pl-6 text-[#b09eb8]">
        <li>
          <strong>Account Cancellation:</strong> You can cancel your account at
          any time through account settings. Your notes will be deleted after a
          30-day grace period.
        </li>
        <li>
          <strong>Subscription Cancellation:</strong> Cancel your paid
          subscription anytime. No refunds are provided for partial months.
        </li>
        <li>
          <strong>Downgrade:</strong> Downgrading from Pro to Free will limit
          your storage. Notes exceeding the free limit will be archived.
        </li>
        <li>
          <strong>Refunds:</strong> Refunds are not provided for cancellations
          made after 7 days of initial purchase, except where required by law.
        </li>
        <li>
          <strong>Data Export:</strong> Before canceling, you can export your
          notes in standard formats for archival or transfer.
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-3xl font-bold">
        7. Privacy and Data Protection
      </h2>
      <p className="mb-4 text-[#b09eb8]">
        Personal data and notes are processed according to our{' '}
        <Link href="/privacy-policy" className="text-primary hover:underline">
          Privacy Policy
        </Link>{' '}
        and applicable data protection regulations (GDPR, CCPA, etc.).
      </p>
      <p className="mb-4 text-[#b09eb8]">
        <strong>Important:</strong> Your notes are encrypted and stored securely
        on our servers. We use industry-standard encryption protocols (TLS/SSL).
        We do not sell, share, or monetize your personal data or notes.
      </p>

      <h2 className="mt-12 mb-4 text-3xl font-bold">
        8. Pricing and Payment Terms
      </h2>
      <ul className="mb-4 list-disc space-y-2 pl-6 text-[#b09eb8]">
        <li>
          <strong>Plan Pricing:</strong> Free, Pro ($9.99/month), and Team
          ($19.99/month) plans with varying features and storage limits.
        </li>
        <li>
          <strong>Billing:</strong> Subscription fees are charged on the date
          you select (monthly or annual). Monthly plans renew automatically.
        </li>
        <li>
          <strong>Payment Methods:</strong> We accept credit cards, debit cards,
          and other payment methods displayed during checkout.
        </li>
        <li>
          <strong>Price Changes:</strong> We may update pricing with 30 days
          notice. Changes apply to renewals, not active subscriptions.
        </li>
        <li>
          <strong>Taxes:</strong> You are responsible for applicable taxes in
          your jurisdiction.
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-3xl font-bold">
        9. Modifications to Terms
      </h2>
      <p className="mb-4 text-[#b09eb8]">
        Snap Notes reserves the right to update these terms and conditions to
        comply with legal changes, improve services, or introduce new features.
        Modifications will be published on this page. Continued use of Snap
        Notes constitutes acceptance of updated terms.
      </p>

      <h2 className="mt-12 mb-4 text-3xl font-bold">
        10. Dispute Resolution and Complaints
      </h2>
      <p className="mb-4 text-[#b09eb8]">
        In case of any issue, complaint, or dispute regarding our services:
      </p>
      <ul className="mb-4 list-disc space-y-2 pl-6 text-[#b09eb8]">
        <li>
          <strong>Support Contact:</strong> Reach out to our support team first
          for amicable resolution.
        </li>
        <li>
          <strong>Response Time:</strong> We respond to support inquiries within
          48 business hours.
        </li>
        <li>
          <strong>Mediation:</strong> If needed, we can engage in mediation or
          arbitration to resolve disputes.
        </li>
        <li>
          <strong>Jurisdiction:</strong> These terms are governed by and
          construed in accordance with the laws of the jurisdiction where Snap
          Notes is registered.
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-3xl font-bold">
        11. Best Practices and Recommendations
      </h2>
      <ul className="mb-4 list-disc space-y-2 pl-6 text-[#b09eb8]">
        <li>
          <strong>Strong Passwords:</strong> Use unique, complex passwords and
          enable two-factor authentication for account security.
        </li>
        <li>
          <strong>Regular Backups:</strong> Periodically export important notes
          as backup copies on your device.
        </li>
        <li>
          <strong>Device Security:</strong> Keep your devices updated with
          latest security patches and antivirus software.
        </li>
        <li>
          <strong>Communication:</strong> Maintain regular communication with
          our support team if you encounter issues or have questions.
        </li>
        <li>
          <strong>Account Management:</strong> Review your subscription and
          usage regularly to optimize your plan selection.
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-3xl font-bold">12. Contact and Support</h2>
      <p className="mb-4 text-[#b09eb8]">
        For questions regarding these terms and conditions, complaints, or
        support, please contact us:
      </p>
      <ul className="mb-4 list-disc space-y-2 pl-6 text-[#b09eb8]">
        <li>
          <strong>Email:</strong>{' '}
          <Link
            href={`mailto:${SITE_CONFIG.company.email}`}
            className="text-primary hover:underline"
          >
            {SITE_CONFIG.company.email}
          </Link>
        </li>
        <li>
          <strong>Phone:</strong>{' '}
          <Link
            href={`tel:${SITE_CONFIG.company.phone}`}
            className="text-primary hover:underline"
          >
            {SITE_CONFIG.company.phone}
          </Link>
        </li>
        <li>
          <strong>Support Form:</strong>{' '}
          <Link href="/contact" className="text-primary hover:underline">
            Contact form
          </Link>
        </li>
        <li>
          <strong>Live Chat:</strong> Available on our website for immediate
          assistance
        </li>
      </ul>
      <p className="mb-8 text-[#b09eb8]">
        <strong>Support Hours:</strong> Monday to Friday 9:00 AM to 6:00 PM
        (EST), Saturday 10:00 AM to 2:00 PM (EST). For urgent account issues
        during off-hours, automated responses will direct you to emergency
        support procedures.
      </p>

      <div className="mt-16 border-t border-[#4d3d54] pt-8">
        <p className="text-sm text-[#b09eb8]/60">
          Last updated: October 23, 2025. These Terms of Service constitute the
          entire agreement between you and Snap Notes regarding the use of our
          services.
        </p>
      </div>
    </section>
  );
}
