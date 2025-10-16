import Head from 'next/head'
import Link from 'next/link'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { ChartBarIcon, CurrencyDollarIcon, ClockIcon, LockClosedIcon, AcademicCapIcon, BeakerIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Science', href: '#science' },
  { name: 'Pricing', href: '#pricing' },
]

const features = [
  {
    name: '🧠 Purpose-Built for Your Practice',
    description: 'Neuralight Pro was designed for providers already using neurofeedback. Upload a brain map (PDF) or complete a CEC-style questionnaire, and the platform generates a 3-stage light therapy protocol — with time, pulse rate, and intensity included.',
    icon: ChartBarIcon,
  },
  {
    name: '⏱️ Streamlined Workflow',
    description: 'No more guesswork. Protocols are tied directly to established neurofeedback recommendations, so you stay in control while saving time.',
    icon: ClockIcon,
  },
  {
    name: '📦 Generate Passive Revenue',
    description: 'Earn $350–$450 per helmet sale. Your annual subscription unlocks wholesale pricing and access to all protocol libraries.',
    icon: CurrencyDollarIcon,
  },
  {
    name: '💡 Expand Patient Care',
    description: 'Offer adjunct care to post-mapping clients. Deliver guided PBM protocols for home use — no neurofeedback machine required.',
    icon: AcademicCapIcon,
  },
  {
    name: '🔒 Private-Labeled Tools',
    description: 'Deliver protocols with your branding or a neutral label. Host Loom-style setup videos to hand off setup directly to patients.',
    icon: LockClosedIcon,
  },
];

const platformFeatures = [
  'Upload PDF maps or complete condition questionnaire (CEC)',
  'Auto-matched PBM protocols tied to 24+ neurofeedback protocols',
  'Built-in 3-phase dosing (Initial, Intermediate, Advanced)',
  'One-click checkout for helmets and accessories',
  'Central dashboard for protocol tracking and updates',
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Neuralight Pro — Grounded in Neurofeedback. Built for Results.</title>
        <meta name="description" content="From Brain Map to Protocol in Minutes. Unlock patient-specific photobiomodulation protocols with a powerful new tool for neurofeedback clinicians." />
      </Head>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Disclosure as="nav" className="bg-white/95 backdrop-blur-sm fixed w-full z-50 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex shrink-0 items-center">
                  <span className="text-2xl font-bold text-indigo-600">Neuralight Pro</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-600 hover:border-indigo-500 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/products"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                >
                  Get Started
                </Link>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  {item.name}
                </DisclosureButton>
              ))}
              <DisclosureButton
                as="a"
                href="/login"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              >
                Sign In
              </DisclosureButton>
              <DisclosureButton
                as="a"
                href="/products"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started
              </DisclosureButton>
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* Hero section */}
        <div className="relative bg-gradient-to-b from-white to-gray-50 pt-16">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-base font-semibold text-indigo-600 mb-2">Grounded in Neurofeedback. Built for Results.</p>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
                From Brain Map to Protocol in Minutes
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-600">
                Unlock patient-specific photobiomodulation protocols with a powerful new tool for neurofeedback clinicians.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/login"
                  className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all transform hover:scale-105"
                >
                  Join Now — Annual Access $399
                </Link>
                <a href="#features" className="text-lg font-semibold leading-6 text-gray-900 flex items-center group">
                  See Sample Protocols <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="mt-16 flow-root sm:mt-24">
              <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&auto=format&fit=crop&q=80"
                  alt="Clinician reviewing brain map on tablet with Neuronic helmet"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Introducing Section */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Introducing Neuralight Pro</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                A precision-guided PBM system for neurofeedback providers. Seamlessly translate your patient's brain map or symptom profile into targeted, three-phase protocols using the Neuronic helmet.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why Neurofeedback Providers Choose Neuralight Pro
              </h2>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="flex flex-col bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-8 hover:shadow-lg transition-shadow">
                    <dt className="text-lg font-semibold leading-7 text-gray-900">
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Features</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Everything you need to deliver precision photobiomodulation therapy
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {platformFeatures.map((feature) => (
                  <div key={feature} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <CheckCircleIcon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                    </dt>
                    <dd className="inline text-gray-600"> {feature}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How It Works</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Three simple steps to deliver targeted photobiomodulation therapy
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-x-8">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <span className="text-3xl font-bold">1</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">Upload Brain Map</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Upload PDF maps or complete condition questionnaire (CEC)
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <span className="text-3xl font-bold">2</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">Choose Complaint</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Auto-matched PBM protocols tied to 24+ neurofeedback protocols
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <span className="text-3xl font-bold">3</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">Get Protocol</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Built-in 3-phase dosing (Initial, Intermediate, Advanced)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Real-World Impact</h2>
            </div>
            <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
              <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-2">
                <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                  <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                    <blockquote className="text-gray-900">
                      <p>
                        "We already map every patient. Neuralight gives us a next step that feels clinical, scalable, and supported."
                      </p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <div>
                        <div className="font-semibold text-gray-900">Dr. Ken</div>
                        <div className="text-gray-600">Neurofeedback Provider</div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
                <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                  <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                    <blockquote className="text-gray-900">
                      <p>
                        "Patients love the convenience. We love the protocol clarity."
                      </p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <div>
                        <div className="font-semibold text-gray-900">Dr. Guy</div>
                        <div className="text-gray-600">BrainCore Founder</div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Science Section */}
        <div id="science" className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">The Science, Simplified</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Photobiomodulation (PBM) has been shown to:
              </p>
            </div>
            <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
              <div className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <CheckCircleIcon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                </dt>
                <dd className="inline">Increase mitochondrial function and cerebral blood flow</dd>
              </div>
              <div className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <CheckCircleIcon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                </dt>
                <dd className="inline">Improve memory, focus, mood, and sleep in clinical contexts</dd>
              </div>
              <div className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <CheckCircleIcon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                </dt>
                <dd className="inline">Synergize with neurofeedback training for sustained gains</dd>
              </div>
            </dl>
            <div className="mt-10 rounded-lg bg-indigo-600 p-8 text-white">
              <h3 className="text-xl font-semibold">What makes Neuralight Pro different?</h3>
              <p className="mt-2 text-base">
                Our protocols are neurofeedback-informed — not generic. We map NFB protocol suggestions to targeted PBM stages, ensuring compatibility and clarity.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Pricing</h2>
            </div>
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8">
              {/* Annual License */}
              <div className="rounded-3xl ring-1 ring-gray-200 p-8 sm:p-10">
                <h3 className="text-lg font-semibold leading-8 text-indigo-600">Annual License</h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  Includes unlimited protocol lookups, wholesale helmet access, and setup guides.
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">$399</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/year</span>
                </p>
                <Link
                  href="/login"
                  className="mt-6 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  🔐 Join Now — Annual Access
                </Link>
              </div>

              {/* Helmet Pricing */}
              <div className="rounded-3xl ring-2 ring-indigo-600 p-8 sm:p-10">
                <h3 className="text-lg font-semibold leading-8 text-indigo-600">Helmet Pricing for Providers</h3>
                <div className="mt-4 text-sm leading-6 text-gray-600">
                  <p><strong>MSRP:</strong> $1,795</p>
                  <p><strong>Provider Rate:</strong> $1,099</p>
                  <p className="text-green-600 font-semibold"><strong>Your Profit Per Unit:</strong> ~$400</p>
                </div>
                <p className="mt-6 text-sm text-gray-600">
                  Optional packages: 1 | 3 | 5 | 10 helmet packs w/ bonus materials
                </p>
                <Link
                  href="/login"
                  className="mt-6 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  📦 Buy Helmet — $1,099 Wholesale
                </Link>
              </div>
            </div>
            <div className="mt-10 text-center">
              <a href="#" className="text-sm font-semibold leading-6 text-indigo-600">
                🎓 See Sample Protocols →
              </a>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-700">
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Extend Your Neurofeedback Offering?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
                Want to simplify your setup even further? Use our Loom video templates to create custom walk-throughs for your patients. No tech support calls. Just results.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/login"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/products',
      permanent: false,
    },
  };
}
