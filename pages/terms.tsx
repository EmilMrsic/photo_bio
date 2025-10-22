import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms and Conditions | Pinguis Vir</title>
        <meta name="description" content="Terms and Conditions for using Pinguis Vir services" />
      </Head>
      <Layout title="Terms and Conditions">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="prose max-w-none">
              <p className="text-sm text-gray-500 mb-6">Last Updated: October 22, 2025</p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to Pinguis Vir. By accessing or using our services, you agree to be bound by these Terms and Conditions. 
                  If you do not agree to these terms, please do not use our services.
                </p>
                <p className="text-gray-700">
                  These Terms and Conditions constitute a legally binding agreement between you and Pinguis Vir 
                  regarding your use of our subscription-based protocol services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Description</h2>
                <p className="text-gray-700 mb-4">
                  Pinguis Vir provides subscription-based access to AI-driven transcranial photobiomodulation (tPBM) protocols. 
                  Our services include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Access to AI-generated tPBM protocols</li>
                  <li>Client management tools</li>
                  <li>Protocol customization based on QEEG data (where applicable)</li>
                  <li>Digital platform for protocol delivery and tracking</li>
                </ul>
                <p className="text-gray-700">
                  Our services are designed for healthcare professionals and individuals seeking to utilize 
                  photobiomodulation technology for wellness purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hardware Disclaimer</h2>
                <p className="text-gray-700 mb-4 font-semibold">
                  IMPORTANT: Photobiomodulation helmets and hardware devices are NOT sold, warranted, or supported by Pinguis Vir.
                </p>
                <p className="text-gray-700 mb-4">
                  All hardware devices, including but not limited to the Neuronic Light and Neuradiant 1070 helmets, 
                  are purchased directly from third-party manufacturers such as Neuronic. Any warranties, support, 
                  returns, or hardware-related issues must be addressed directly with the hardware manufacturer.
                </p>
                <p className="text-gray-700 mb-4">
                  Pinguis Vir is solely responsible for providing software-based protocol services and makes no 
                  representations or warranties regarding the safety, efficacy, or performance of any hardware devices.
                </p>
                <p className="text-gray-700">
                  For hardware purchases, warranties, and support, please contact the manufacturer directly at{' '}
                  <a href="https://www.neuronic.online" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                    www.neuronic.online
                  </a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription Terms</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.1 Payment</h3>
                <p className="text-gray-700 mb-4">
                  By subscribing to our services, you agree to pay all applicable fees associated with your chosen subscription plan. 
                  Fees are charged in advance on a recurring basis (monthly or annually, depending on your plan).
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Automatic Renewal</h3>
                <p className="text-gray-700 mb-4">
                  Your subscription will automatically renew at the end of each billing period unless you cancel prior to the renewal date. 
                  You authorize us to charge your payment method for renewal fees.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 Cancellation</h3>
                <p className="text-gray-700 mb-4">
                  You may cancel your subscription at any time through your account settings or by contacting us at{' '}
                  <a href="mailto:dreagle@braincoresystems.com" className="text-indigo-600 hover:text-indigo-500">
                    dreagle@braincoresystems.com
                  </a>. 
                  Cancellation will take effect at the end of your current billing period.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.4 No Refunds</h3>
                <p className="text-gray-700 mb-4 font-semibold">
                  All subscription fees are non-refundable. Once payment is processed, no refunds will be issued for partial 
                  subscription periods, unused services, or early cancellation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Accounts</h2>
                <p className="text-gray-700 mb-4">
                  To access our services, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized access or security breach</li>
                </ul>
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate accounts that violate these terms or are inactive for extended periods.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy and Data Collection</h2>
                <p className="text-gray-700 mb-4">
                  We collect and process personal information in accordance with our Privacy Policy. By using our services, 
                  you consent to our collection and use of data as described in the Privacy Policy.
                </p>
                <p className="text-gray-700 mb-4">
                  Our services use tracking technologies including cookies, analytics tools, and user authentication systems 
                  to provide, improve, and secure our platform. This data helps us understand how our services are used and 
                  to enhance user experience.
                </p>
                <p className="text-gray-700">
                  For detailed information about our data practices, please review our{' '}
                  <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                    Privacy Policy
                  </Link>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  All content, protocols, software, designs, text, graphics, and other materials provided through our services 
                  are owned by Pinguis Vir or our licensors and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-700 mb-4">
                  You are granted a limited, non-exclusive, non-transferable license to access and use our services for your 
                  personal or professional use in accordance with these terms. You may not:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Copy, modify, or distribute our proprietary content or protocols</li>
                  <li>Reverse engineer or attempt to extract source code from our software</li>
                  <li>Remove or alter any copyright, trademark, or proprietary notices</li>
                  <li>Use our services to create competing products or services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. User Responsibilities and Acceptable Use</h2>
                <p className="text-gray-700 mb-4">
                  You agree to use our services only for lawful purposes and in accordance with these terms. You agree not to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Use the services in any way that violates applicable laws or regulations</li>
                  <li>Share your account credentials with others</li>
                  <li>Transmit any malicious code, viruses, or harmful materials</li>
                  <li>Attempt to gain unauthorized access to our systems or other user accounts</li>
                  <li>Use automated systems or software to extract data from our services</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                </ul>
                <p className="text-gray-700">
                  If you are a healthcare professional, you agree to use our protocols in accordance with applicable professional 
                  standards, regulations, and within your scope of practice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Medical Disclaimer</h2>
                <p className="text-gray-700 mb-4 font-semibold">
                  IMPORTANT: Pinguis Vir services are intended for general wellness purposes only and are not intended to diagnose, 
                  treat, cure, or prevent any disease or medical condition.
                </p>
                <p className="text-gray-700 mb-4">
                  Our protocols and services do not constitute medical advice. You should consult with a qualified healthcare 
                  professional before beginning any new health regimen or treatment protocol.
                </p>
                <p className="text-gray-700 mb-4">
                  If you are a healthcare professional using our services with your clients or patients, you maintain full 
                  responsibility for all clinical decisions and the application of our protocols within your practice.
                </p>
                <p className="text-gray-700">
                  Individual results may vary. We make no guarantees regarding the effectiveness or outcomes of using our protocols.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimers and Limitation of Liability</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">10.1 Service Disclaimer</h3>
                <p className="text-gray-700 mb-4">
                  OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
                  INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
                <p className="text-gray-700 mb-4">
                  We do not warrant that our services will be uninterrupted, error-free, or completely secure. We reserve the right 
                  to modify, suspend, or discontinue any aspect of our services at any time without notice.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">10.2 Limitation of Liability</h3>
                <p className="text-gray-700 mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, PINGUIS VIR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, 
                  OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Your access to or use of (or inability to access or use) our services</li>
                  <li>Any conduct or content of any third party on our services</li>
                  <li>Any content obtained from our services</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  IN NO EVENT SHALL OUR AGGREGATE LIABILITY EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS 
                  PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
                <p className="text-gray-700 mb-4">
                  You agree to indemnify, defend, and hold harmless Pinguis Vir and its officers, directors, employees, and agents 
                  from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, 
                  arising out of or in any way connected with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Your access to or use of our services</li>
                  <li>Your violation of these Terms and Conditions</li>
                  <li>Your violation of any rights of another person or entity</li>
                  <li>Your use of protocols with clients or patients (if applicable)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law and Dispute Resolution</h2>
                <p className="text-gray-700 mb-4">
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of South Carolina, 
                  without regard to its conflict of law provisions.
                </p>
                <p className="text-gray-700 mb-4">
                  Any disputes arising out of or relating to these terms or our services shall be resolved exclusively in the state or 
                  federal courts located in South Carolina, and you consent to the personal jurisdiction of such courts.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these Terms and Conditions at any time. We will notify users of any material changes 
                  by posting the updated terms on our website and updating the "Last Updated" date.
                </p>
                <p className="text-gray-700 mb-4">
                  Your continued use of our services after any changes to these terms constitutes your acceptance of the modified terms. 
                  If you do not agree to the modified terms, you must discontinue use of our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Severability</h2>
                <p className="text-gray-700 mb-4">
                  If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions 
                  shall remain in full force and effect. The invalid or unenforceable provision shall be replaced with a valid provision 
                  that most closely reflects the original intent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Entire Agreement</h2>
                <p className="text-gray-700 mb-4">
                  These Terms and Conditions, together with our Privacy Policy and any other legal notices published by us, 
                  constitute the entire agreement between you and Pinguis Vir concerning your use of our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions, concerns, or requests regarding these Terms and Conditions, please contact us at:
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
              </section>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  By using Pinguis Vir services, you acknowledge that you have read, understood, and agree to be bound by these 
                  Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
