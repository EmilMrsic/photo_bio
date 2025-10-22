import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Pinguis Vir</title>
        <meta name="description" content="Privacy Policy for Pinguis Vir services" />
      </Head>
      <Layout title="Privacy Policy">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="prose max-w-none">
              <p className="text-sm text-gray-500 mb-6">Last Updated: October 22, 2025</p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to Pinguis Vir. We are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
                </p>
                <p className="text-gray-700 mb-4">
                  By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. 
                  If you do not agree with the terms of this Privacy Policy, please do not use our services.
                </p>
                <p className="text-gray-700">
                  This Privacy Policy applies to our subscription-based AI-driven transcranial photobiomodulation (tPBM) protocol services, 
                  including our web platform, client management tools, and related services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.1 Personal Information</h3>
                <p className="text-gray-700 mb-4">
                  We collect personal information that you voluntarily provide to us when you register for an account, 
                  subscribe to our services, or communicate with us. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Professional information (credentials, practice details for healthcare providers)</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Profile information and preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Client and Patient Data</h3>
                <p className="text-gray-700 mb-4">
                  If you are a healthcare professional using our services with clients or patients, you may provide:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Client/patient names and contact information</li>
                  <li>QEEG (Quantitative Electroencephalogram) data and brain mapping information</li>
                  <li>Health-related information relevant to protocol customization</li>
                  <li>Treatment notes and protocol usage records</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  You are responsible for obtaining appropriate consent from your clients/patients before uploading their data to our platform.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.3 Usage Data</h3>
                <p className="text-gray-700 mb-4">
                  We automatically collect certain information about your device and how you interact with our services, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>IP address, browser type, and operating system</li>
                  <li>Device identifiers and characteristics</li>
                  <li>Pages viewed, features used, and actions taken</li>
                  <li>Date and time stamps of your activities</li>
                  <li>Referring URLs and clickstream data</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.4 Cookies and Tracking Technologies</h3>
                <p className="text-gray-700 mb-4">
                  We use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities. 
                  See Section 5 for more details about our use of cookies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">
                  We use the information we collect for various purposes, including:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.1 Service Delivery</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Providing access to our AI-driven tPBM protocol services</li>
                  <li>Creating and managing your account</li>
                  <li>Processing subscriptions and payments</li>
                  <li>Generating personalized protocols based on QEEG data</li>
                  <li>Enabling client management and protocol delivery features</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Service Improvement and Development</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Analyzing usage patterns to improve our services</li>
                  <li>Developing new features and functionality</li>
                  <li>Training and improving our AI algorithms</li>
                  <li>Conducting research and data analysis</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.3 Communication</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Sending service-related notifications and updates</li>
                  <li>Responding to your inquiries and support requests</li>
                  <li>Providing important account and subscription information</li>
                  <li>Sending promotional materials (with your consent, where required)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.4 Security and Legal Compliance</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Detecting and preventing fraud, abuse, and security incidents</li>
                  <li>Enforcing our Terms and Conditions</li>
                  <li>Complying with legal obligations and responding to legal requests</li>
                  <li>Protecting the rights, property, and safety of Pinguis Vir and our users</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
                <p className="text-gray-700 mb-4">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.1 Third-Party Service Providers</h3>
                <p className="text-gray-700 mb-4">
                  We use trusted third-party service providers to help us operate our business and deliver our services:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Xano</strong> - Backend database and API services for data storage and processing</li>
                  <li><strong>Memberstack</strong> - User authentication and membership management</li>
                  <li><strong>Analytics providers</strong> - Web analytics and usage tracking (such as Plausible Analytics or Google Analytics)</li>
                  <li><strong>Payment processors</strong> - Secure payment processing for subscriptions</li>
                  <li><strong>Cloud hosting services</strong> - Infrastructure and hosting providers</li>
                  <li><strong>Email service providers</strong> - Transactional and marketing email delivery</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  These service providers are contractually obligated to use your information only for the purposes of providing 
                  services to us and are required to maintain appropriate security measures.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Business Transfers</h3>
                <p className="text-gray-700 mb-4">
                  If Pinguis Vir is involved in a merger, acquisition, reorganization, or sale of assets, your information may be 
                  transferred as part of that transaction. We will notify you of any such change and any choices you may have.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 Legal Requirements</h3>
                <p className="text-gray-700 mb-4">
                  We may disclose your information if required to do so by law or in response to valid requests by public authorities, 
                  including to meet national security or law enforcement requirements.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.4 Protection of Rights</h3>
                <p className="text-gray-700 mb-4">
                  We may disclose information when we believe it is necessary to protect our rights, protect your safety or the safety 
                  of others, investigate fraud, or respond to a government request.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.5 Hardware Manufacturers</h3>
                <p className="text-gray-700 mb-4">
                  We do not share your data with hardware manufacturers. Photobiomodulation helmets and hardware devices are not sold 
                  by Pinguis Vir, and any data collected by such devices is subject to the manufacturer's privacy policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to enhance your experience and collect information about how you use our services.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.1 Types of Cookies We Use</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Essential Cookies</strong> - Required for the operation of our services, including authentication and security</li>
                  <li><strong>Functional Cookies</strong> - Enable enhanced functionality and personalization</li>
                  <li><strong>Analytics Cookies</strong> - Help us understand how users interact with our services</li>
                  <li><strong>Marketing Cookies</strong> - Used to track visitors across websites for advertising purposes (with consent)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Managing Cookies</h3>
                <p className="text-gray-700 mb-4">
                  Most web browsers allow you to control cookies through their settings. You can typically set your browser to refuse 
                  cookies or alert you when cookies are being sent. However, if you disable cookies, some features of our services 
                  may not function properly.
                </p>
                <p className="text-gray-700">
                  For more information about cookies and how to manage them, visit{' '}
                  <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                    www.allaboutcookies.org
                  </a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Encryption of data in transit using SSL/TLS protocols</li>
                  <li>Encryption of sensitive data at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data security and privacy</li>
                  <li>Secure backup and disaster recovery procedures</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use 
                  commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
                </p>
                <p className="text-gray-700">
                  You are responsible for maintaining the confidentiality of your account credentials and for any activities that 
                  occur under your account. Please notify us immediately of any unauthorized access or use of your account.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                  unless a longer retention period is required or permitted by law.
                </p>
                <p className="text-gray-700 mb-4">
                  Specifically, we retain:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Account information</strong> - For the duration of your active subscription and for a reasonable period after cancellation</li>
                  <li><strong>Client/patient data</strong> - As long as your account is active or as required by applicable healthcare regulations</li>
                  <li><strong>Transaction records</strong> - For accounting and legal compliance purposes, typically 7 years</li>
                  <li><strong>Usage data</strong> - Aggregated and anonymized usage data may be retained indefinitely for analytics purposes</li>
                </ul>
                <p className="text-gray-700">
                  When we no longer need your information, we will securely delete or anonymize it in accordance with our data retention policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Privacy Rights</h2>
                <p className="text-gray-700 mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.1 Access and Portability</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to request access to the personal information we hold about you and to receive a copy of your data 
                  in a portable format.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.2 Correction</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to request correction of inaccurate or incomplete personal information. You can update most of your 
                  account information directly through your account settings.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.3 Deletion</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to request deletion of your personal information, subject to certain legal exceptions (such as 
                  records we must retain for compliance purposes).
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.4 Restriction and Objection</h3>
                <p className="text-gray-700 mb-4">
                  You may have the right to restrict or object to certain processing of your personal information, including for 
                  marketing purposes.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.5 Exercising Your Rights</h3>
                <p className="text-gray-700 mb-4">
                  To exercise any of these rights, please contact us at{' '}
                  <a href="mailto:dreagle@braincoresystems.com" className="text-indigo-600 hover:text-indigo-500">
                    dreagle@braincoresystems.com
                  </a>. 
                  We will respond to your request within a reasonable timeframe and in accordance with applicable law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Services and Links</h2>
                <p className="text-gray-700 mb-4">
                  Our services may contain links to third-party websites, services, or applications that are not owned or controlled by Pinguis Vir. 
                  This Privacy Policy does not apply to third-party services.
                </p>
                <p className="text-gray-700 mb-4">
                  We encourage you to review the privacy policies of any third-party services you access through our platform:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Xano privacy policy: <a href="https://www.xano.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">www.xano.com/privacy</a></li>
                  <li>Memberstack privacy policy: <a href="https://www.memberstack.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">www.memberstack.com/privacy</a></li>
                  <li>Hardware manufacturer (Neuronic): <a href="https://www.neuronic.online" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">www.neuronic.online</a></li>
                </ul>
                <p className="text-gray-700">
                  We are not responsible for the privacy practices of third parties and encourage you to read their privacy policies 
                  before providing any personal information to them.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information 
                  from children under 18.
                </p>
                <p className="text-gray-700 mb-4">
                  If you are a parent or guardian and believe that your child has provided us with personal information, please contact 
                  us immediately. If we become aware that we have collected personal information from a child under 18 without 
                  verification of parental consent, we will take steps to delete that information.
                </p>
                <p className="text-gray-700">
                  Healthcare providers using our services to manage pediatric clients/patients are responsible for obtaining appropriate 
                  consent from parents or guardians before uploading any information about minors.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. International Users and Data Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Pinguis Vir operates primarily in the United States. If you are accessing our services from outside the United States, 
                  please be aware that your information may be transferred to, stored, and processed in the United States or other 
                  countries where our service providers operate.
                </p>
                <p className="text-gray-700 mb-4">
                  Data protection laws in the United States and other countries may be different from those in your country. By using 
                  our services, you consent to the transfer of your information to the United States and other countries.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">11.1 European Users (GDPR)</h3>
                <p className="text-gray-700 mb-4">
                  If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have additional rights 
                  under the General Data Protection Regulation (GDPR), including the right to lodge a complaint with a supervisory authority.
                </p>
                <p className="text-gray-700 mb-4">
                  We process your personal information based on the following legal bases:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Contract performance</strong> - To provide our services as outlined in our Terms and Conditions</li>
                  <li><strong>Legitimate interests</strong> - To improve our services, prevent fraud, and ensure security</li>
                  <li><strong>Legal compliance</strong> - To comply with applicable laws and regulations</li>
                  <li><strong>Consent</strong> - Where you have provided consent for specific processing activities</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">11.2 California Users (CCPA)</h3>
                <p className="text-gray-700 mb-4">
                  If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA), including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>The right to know what personal information we collect, use, and disclose</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to opt-out of the sale of personal information (we do not sell personal information)</li>
                  <li>The right to non-discrimination for exercising your privacy rights</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, 
                  or other factors. When we make material changes, we will notify you by:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Posting the updated Privacy Policy on our website with a new "Last Updated" date</li>
                  <li>Sending an email notification to the address associated with your account</li>
                  <li>Displaying a prominent notice on our platform</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                </p>
                <p className="text-gray-700">
                  Your continued use of our services after any changes to this Privacy Policy constitutes your acceptance of the updated terms. 
                  If you do not agree with the changes, you should discontinue use of our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 font-semibold">Pinguis Vir</p>
                  <p className="text-gray-700">
                    Email:{' '}
                    <a href="mailto:dreagle@braincoresystems.com" className="text-indigo-600 hover:text-indigo-500">
                      dreagle@braincoresystems.com
                    </a>
                  </p>
                </div>
                <p className="text-gray-700 mt-4">
                  For our complete Terms and Conditions, please visit our{' '}
                  <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                    Terms and Conditions page
                  </Link>.
                </p>
              </section>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  By using Pinguis Vir services, you acknowledge that you have read, understood, and agree to this Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
