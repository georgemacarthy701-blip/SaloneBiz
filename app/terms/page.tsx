import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            <span>←</span> <span className="ml-1.5">Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 md:p-12 text-white shadow-xl mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="mt-4 text-blue-100 text-lg leading-relaxed max-w-2xl">
            Welcome to SaloneBiz. Please read our terms, rules, and guidelines carefully before listing or browsing services on our platform.
          </p>
          <div className="mt-6 inline-flex items-center space-x-2 text-xs text-blue-200 bg-blue-800/40 border border-blue-700/50 px-3 py-1 rounded-full">
            <span>Last Updated: June 17, 2026</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-8 md:p-12 shadow-sm space-y-10 text-gray-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              1. Agreement to Terms
            </h2>
            <p className="leading-relaxed">
              By accessing, browsing, or registering on the SaloneBiz platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              2. Marketplace Directory Rules
            </h2>
            <p className="leading-relaxed">
              SaloneBiz is a professional marketplace connecting providers with clients. All users must comply with the following rules:
            </p>
            <ul className="list-disc pl-6 space-y-2.5">
              <li>
                <strong className="text-gray-900">Honest Representation:</strong> Service providers must describe their services, skills, pricing, and qualifications accurately and honestly.
              </li>
              <li>
                <strong className="text-gray-900">Review Integrity:</strong> Reviews must represent genuine client experiences. Fraudulent, paid-for, or malicious reviews are strictly prohibited.
              </li>
              <li>
                <strong className="text-gray-900">Media Suitability:</strong> All image and video uploads must be business-appropriate, legal, and free of copyright infringements.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              3. Accounts, Verification & Approvals
            </h2>
            <p className="leading-relaxed">
              To list a service, providers must register an account. SaloneBiz administrators reserve the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2.5">
              <li>Review all registration submissions and request further information.</li>
              <li>Approve, pending, or reject user listings based on verification protocols.</li>
              <li>Suspend or terminate accounts that violate platform policies or display deceptive behavior.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              4. Prohibited Activities
            </h2>
            <p className="leading-relaxed">
              You agree not to engage in any of the following activities on the platform:
            </p>
            <ul className="list-disc pl-6 space-y-2.5">
              <li>Spamming, posting duplicate listings, or miscategorizing services.</li>
              <li>Uploading malicious files, scripts, or executing scrapers.</li>
              <li>Impersonating other service providers or clients.</li>
              <li>Violating local consumer rights and directory listing guidelines.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              5. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              All branding elements, layout designs, and software components of SaloneBiz are the property of SaloneBiz. Providers retain ownership of the media and description content they upload, but grant SaloneBiz a non-exclusive license to display, crop, and promote that content across the directory platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              6. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              SaloneBiz lists services as-is and does not guarantee the performance, delivery, or quality of services rendered by independent providers. Users coordinate transactions and business relationships at their own risk. We are not liable for any disputes, damages, or financial losses resulting from provider-client engagements.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              7. Governing Law
            </h2>
            <p className="leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of Sierra Leone, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              8. Contact Support
            </h2>
            <p className="leading-relaxed">
              For any clarifications regarding these terms, please reach out to our administration team:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-2 w-fit">
              <p className="text-sm"><strong className="text-gray-900">Email:</strong> <a href="mailto:salonebiz9@gmail.com" className="text-blue-600 hover:underline">salonebiz9@gmail.com</a></p>
              <p className="text-sm"><strong className="text-gray-900">Phone:</strong> <a href="tel:+23280442328" className="text-blue-600 hover:underline">+23280442328</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
