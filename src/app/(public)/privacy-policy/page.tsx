import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

export const metadata = {
  title: "Privacy Policy | SnapNotes",
  description: "Read the Privacy Policy for using Snap Notes.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="pt-32 pb-16 px-4 mx-auto max-w-4xl text-white animate-fade-in">
      <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-lg text-[#b09eb8] mb-8">
        At Snap Notes, we are committed to protecting the privacy of our users
        and customers. Below, we explain how we collect, use, and protect your
        personal data when you access our application, create notes, store data,
        or subscribe to our services.
      </p>

      <h2 className="text-3xl font-bold mt-12 mb-4">
        1. Data Controller and Responsibility
      </h2>
      <p className="mb-4 text-[#b09eb8]">
        The data controller is Snap Notes, located at{" "}
        {SITE_CONFIG.company.address}. For any inquiries related to data
        protection and privacy, you can contact us at:
      </p>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Email:</strong>{" "}
          <Link
            href={`mailto:${SITE_CONFIG.company.email}`}
            className="text-primary hover:underline"
          >
            {SITE_CONFIG.company.email}
          </Link>
        </li>
        <li>
          <strong>Phone:</strong>{" "}
          <Link
            href={`tel:${SITE_CONFIG.company.phone}`}
            className="text-primary hover:underline"
          >
            {SITE_CONFIG.company.phone}
          </Link>
        </li>
        <li>
          <strong>Contact Form:</strong>{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
        </li>
      </ul>

      <h2 className="text-3xl font-bold mt-12 mb-4">2. Data We Collect</h2>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Identification data:</strong> Full name, email address, phone
          number, password hash, profile information.
        </li>
        <li>
          <strong>Account data:</strong> Subscription tier, billing information,
          payment method, usage statistics, storage quota.
        </li>
        <li>
          <strong>Note content:</strong> All notes, documents, and files you
          create, upload, or store within Snap Notes (encrypted and stored
          securely).
        </li>
        <li>
          <strong>Usage data:</strong> Devices used, application access times,
          features accessed, synchronization information, crash reports.
        </li>
        <li>
          <strong>Technical data:</strong> IP address, device type, operating
          system, browser information, cookies, unique device identifiers.
        </li>
        <li>
          <strong>Communication data:</strong> Messages sent through support
          forms, feedback, feature requests, and customer support tickets.
        </li>
      </ul>

      <h2 className="text-3xl font-bold mt-12 mb-4">
        3. Purpose of Data Processing
      </h2>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Service Delivery:</strong> Create and manage your account,
          store and sync your notes across devices, provide cloud storage and
          backup functionality.
        </li>
        <li>
          <strong>Account Management:</strong> Process billing, manage
          subscriptions, handle renewals and cancellations, send receipts and
          invoices.
        </li>
        <li>
          <strong>Communication:</strong> Send account notifications, security
          alerts, password resets, service updates, and respond to support
          inquiries.
        </li>
        <li>
          <strong>Service Improvement:</strong> Analyze usage patterns, improve
          features, optimize performance, and personalize user experience.
        </li>
        <li>
          <strong>Security:</strong> Detect fraud, prevent abuse, ensure
          platform security, and protect user accounts.
        </li>
        <li>
          <strong>Legal Compliance:</strong> Comply with laws, regulations, tax
          requirements, and respond to legal requests.
        </li>
        <li>
          <strong>Marketing (with consent):</strong> Send newsletters, product
          announcements, promotional offers, and feature updates.
        </li>
      </ul>

      <h2 className="text-3xl font-bold mt-12 mb-4">
        4. Legal Basis for Processing
      </h2>
      <p className="mb-4 text-[#b09eb8]">
        We process your data based on the following legal grounds:
      </p>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Consent:</strong> For marketing communications, optional
          analytics, and feature subscriptions.
        </li>
        <li>
          <strong>Contract Performance:</strong> To provide the Snap Notes
          service you have subscribed to.
        </li>
        <li>
          <strong>Legitimate Interest:</strong> To improve services, prevent
          fraud, ensure security, and provide customer support.
        </li>
        <li>
          <strong>Legal Obligation:</strong> To comply with tax, legal, and
          regulatory requirements.
        </li>
      </ul>

      <h2 className="text-3xl font-bold mt-12 mb-4">
        5. Data Retention Periods
      </h2>
      <p className="mb-4 text-[#b09eb8]">
        We retain your data for different periods depending on the type and
        purpose:
      </p>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Active Account Data:</strong> While your account is active and
          for 30 days after deletion (grace period for recovery).
        </li>
        <li>
          <strong>Deleted Notes:</strong> Retained in secure backups for up to
          90 days before permanent deletion.
        </li>
        <li>
          <strong>Billing Records:</strong> Retained for 7 years to comply with
          tax and accounting regulations.
        </li>
        <li>
          <strong>Support Communications:</strong> Retained for 2 years or as
          long as necessary to resolve issues.
        </li>
        <li>
          <strong>Marketing Preferences:</strong> Until you withdraw consent or
          for 3 years of inactivity.
        </li>
        <li>
          <strong>Technical Logs:</strong> Retained for up to 90 days for
          security and troubleshooting purposes.
        </li>
      </ul>

      <h2 className="text-3xl font-bold mt-12 mb-4">
        6. Data Recipients and Sharing
      </h2>
      <p className="mb-4 text-[#b09eb8]">
        We may share your data with third parties in the following
        circumstances:
      </p>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Payment Processors:</strong> Stripe, PayPal, and other payment
          providers (only payment information necessary for billing).
        </li>
        <li>
          <strong>Cloud Infrastructure Providers:</strong> AWS, Google Cloud,
          and data center operators (under strict data processing agreements).
        </li>
        <li>
          <strong>Analytics Services:</strong> Google Analytics, Sentry, and
          monitoring tools for performance and error tracking.
        </li>
        <li>
          <strong>Customer Support Platforms:</strong> Helpdesk and ticketing
          systems for managing support requests.
        </li>
        <li>
          <strong>Email Services:</strong> SendGrid, Mailgun for sending
          transactional emails and notifications.
        </li>
        <li>
          <strong>Compliance Authorities:</strong> Law enforcement and
          government agencies when legally required.
        </li>
        <li>
          <strong>Business Partners:</strong> In case of merger, acquisition, or
          business transfer (with appropriate safeguards).
        </li>
      </ul>
      <p className="mb-4 text-[#b09eb8]">
        All third parties are contractually bound to maintain confidentiality
        and use data only for specified purposes.
      </p>

      <h2 className="text-3xl font-bold mt-12 mb-4">
        7. International Data Transfers
      </h2>
      <p className="mb-4 text-[#b09eb8]">
        Your data may be transferred to and stored in countries outside your
        location, including the European Economic Area (EEA):
      </p>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Cloud Storage:</strong> Data may be stored on servers in
          multiple countries for redundancy and availability.
        </li>
        <li>
          <strong>Service Providers:</strong> Some processors may have servers
          in countries with different privacy laws.
        </li>
        <li>
          <strong>Legal Compliance:</strong> We comply with Standard Contractual
          Clauses (SCCs) and adequacy decisions for all international transfers.
        </li>
      </ul>
      <p className="mb-4 text-[#b09eb8]">
        We ensure appropriate safeguards are in place, including Data Processing
        Agreements and compliance with GDPR and international data protection
        regulations.
      </p>

      <h2 className="text-3xl font-bold mt-12 mb-4">8. Your Rights</h2>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Right of Access:</strong> Request a copy of your personal data
          we hold.
        </li>
        <li>
          <strong>Right to Rectification:</strong> Correct inaccurate or
          incomplete information.
        </li>
        <li>
          <strong>Right to Erasure:</strong> Request deletion of your data
          (subject to legal obligations).
        </li>
        <li>
          <strong>Right to Restrict Processing:</strong> Limit how we use your
          data.
        </li>
        <li>
          <strong>Right to Data Portability:</strong> Download your data in a
          structured, machine-readable format.
        </li>
        <li>
          <strong>Right to Object:</strong> Opt-out of marketing communications
          and certain processing activities.
        </li>
        <li>
          <strong>Right to Withdraw Consent:</strong> Withdraw consent for any
          processing at any time.
        </li>
      </ul>
      <p className="mb-4 text-[#b09eb8]">
        To exercise these rights, please contact us:
      </p>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Email:</strong>{" "}
          <Link
            href={`mailto:${SITE_CONFIG.company.email}`}
            className="text-primary hover:underline"
          >
            {SITE_CONFIG.company.email}
          </Link>
        </li>
        <li>
          <strong>Support Form:</strong>{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
        </li>
      </ul>

      <h2 className="text-3xl font-bold mt-12 mb-4">9. Data Security</h2>
      <p className="mb-4 text-[#b09eb8]">
        We implement industry-leading technical and organizational measures to
        protect your personal data:
      </p>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Encryption in Transit:</strong> All data transmitted uses
          TLS/SSL encryption (256-bit or higher).
        </li>
        <li>
          <strong>Encryption at Rest:</strong> Sensitive data is encrypted using
          AES-256 or equivalent.
        </li>
        <li>
          <strong>Access Control:</strong> Only authorized personnel can access
          user data, with role-based access controls.
        </li>
        <li>
          <strong>Regular Backups:</strong> Automated backups stored
          geographically for disaster recovery.
        </li>
        <li>
          <strong>Security Audits:</strong> Regular penetration testing and
          security assessments.
        </li>
        <li>
          <strong>Incident Response:</strong> We maintain protocols to respond
          to and report security breaches if they occur.
        </li>
        <li>
          <strong>Employee Training:</strong> All staff receive data protection
          and security training.
        </li>
      </ul>

      <h2 className="text-3xl font-bold mt-12 mb-4">10. Policy Updates</h2>
      <p className="mb-4 text-[#b09eb8]">
        We reserve the right to modify this privacy policy to adapt to
        legislative changes, new features, or security improvements. Any
        significant changes will be communicated via email or prominent notice
        on our website. Your continued use of Snap Notes constitutes acceptance
        of updated terms.
      </p>

      <h2 className="text-3xl font-bold mt-12 mb-4">
        11. Cookies and Tracking Technology
      </h2>
      <p className="mb-4 text-[#b09eb8]">
        Snap Notes uses cookies and similar tracking technologies to improve
        your experience, remember preferences, analyze usage, and provide
        personalized features.
      </p>

      <h3 className="text-2xl font-semibold mt-8 mb-3">What are Cookies?</h3>
      <p className="mb-4 text-[#b09eb8]">
        Cookies are small text files stored on your device when you access our
        application. They help us remember your preferences, authentication
        status, and usage patterns to enhance your experience.
      </p>

      <h3 className="text-2xl font-semibold mt-8 mb-3">
        Types of Cookies We Use
      </h3>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Essential Cookies:</strong> Required for basic functionality
          (authentication, security, session management).
        </li>
        <li>
          <strong>Performance Cookies:</strong> Analyze how you use Snap Notes
          to improve features and performance (Google Analytics, Sentry).
        </li>
        <li>
          <strong>Preference Cookies:</strong> Remember your settings,
          notification preferences, and personalization choices.
        </li>
        <li>
          <strong>Marketing Cookies:</strong> Track your interest in features to
          show relevant content and offers (with your consent).
        </li>
        <li>
          <strong>Third-Party Cookies:</strong> Set by external services for
          analytics, payments, and integrations.
        </li>
      </ul>

      <h3 className="text-2xl font-semibold mt-8 mb-3">Managing Cookies</h3>
      <p className="mb-4 text-[#b09eb8]">
        You can control cookies through your browser settings. Most browsers
        allow you to:
      </p>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>Accept or reject all cookies</li>
        <li>Accept only certain types of cookies</li>
        <li>Delete existing cookies</li>
        <li>Receive notifications when new cookies are set</li>
      </ul>
      <p className="mb-4 text-[#b09eb8]">
        <strong>Important:</strong> Disabling essential cookies may affect
        functionality of the Snap Notes application and your ability to log in
        or access your notes.
      </p>

      <h3 className="text-2xl font-semibold mt-8 mb-3">
        Third-Party Services Using Cookies
      </h3>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Google Analytics:</strong> Tracking website and app usage
          patterns
        </li>
        <li>
          <strong>Stripe/PayPal:</strong> Processing payments securely
        </li>
        <li>
          <strong>Sentry:</strong> Monitoring errors and application performance
        </li>
        <li>
          <strong>Microsoft/Google Auth:</strong> Authentication services
        </li>
      </ul>
      <p className="mb-4 text-[#b09eb8]">
        Please review their privacy policies for information about their cookie
        usage and data practices.
      </p>

      <h2 className="text-3xl font-bold mt-12 mb-4">12. Contact and Support</h2>
      <p className="mb-4 text-[#b09eb8]">
        If you have questions about this privacy policy, concerns about your
        data, or wish to exercise your rights, please contact us:
      </p>
      <ul className="list-disc pl-6 text-[#b09eb8] mb-4 space-y-2">
        <li>
          <strong>Email:</strong>{" "}
          <Link
            href={`mailto:${SITE_CONFIG.company.email}`}
            className="text-primary hover:underline"
          >
            {SITE_CONFIG.company.email}
          </Link>
        </li>
        <li>
          <strong>Contact Form:</strong>{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Submit a request
          </Link>
        </li>
        <li>
          <strong>Response Time:</strong> We respond to privacy inquiries within
          30 days as required by law
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t border-[#4d3d54]">
        <p className="text-sm text-[#b09eb8]/60">
          Last updated: October 23, 2025. We recommend reviewing this policy
          periodically for updates. Your continued use of Snap Notes constitutes
          acceptance of this Privacy Policy.
        </p>
      </div>
    </section>
  );
}
