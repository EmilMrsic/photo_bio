import Head from 'next/head'
import Link from 'next/link'
import { Disclosure, DisclosureButton, DisclosurePanel, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import PurchaseFlow from '../components/PurchaseFlow'
import { useMemberstack } from '../hooks/useMemberstack'
import { useRouter } from 'next/router'
import Footer from '../components/Footer'

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Science', href: '#science' },
  { name: 'Pricing', href: '#pricing' },
]

const products = [
  {
    id: 'option-one',
    title: 'Neuronics Light Package',
    productName: 'Affordable. Portable. Powerful.',
    tagline: 'Entry-Level tPBM System',
    features: [
      '1 year of unlimited AI-driven tPBM protocols',
      'Unlimited clients',
      'Direct drop-shipping to your client or your office',
      'Perfect for providers who want to offer an affordable, at-home tPBM option',
      'Ideal for patients focused on maintaining brain health, improving focus, and reducing stress',
      'Reliable, full-coverage stimulation at an accessible price point',
    ],
    bestFit: 'The perfect entry point into tPBM technology. Delivers reliable, full-coverage stimulation at an accessible price point—ideal for clinics looking to expand their offerings or for patients seeking an at-home solution.',
    price: '',
    priceNote: '',
    cta: 'Get Started',
    checkoutUrl: 'https://buy.stripe.com/5kQfZh9Qi24xdyQ7zIe3e01',
    imagePlaceholder: '/main-images/side view of helmet.jpg',
  },
  {
    id: 'option-two',
    title: 'Neuronics Neuroradiant 1070 Package',
    productName: 'Clinical-Grade Precision. Peak Performance Results.',
    tagline: 'Advanced Clinical-Grade System',
    features: [
      '1 year of unlimited AI-driven tPBM protocols',
      'Unlimited clients',
      'Direct drop-shipping to your client or your office',
      'Advanced, research-grade tPBM system for your practice',
      'Targeted 1070 nm near-infrared stimulation for deeper brain structures',
      'Enhanced brain performance, recovery, and neurorehabilitation support',
      'Premium technology for clinical and high-performance applications',
    ],
    bestFit: 'Delivers targeted 1070 nm near-infrared stimulation designed to reach deeper brain structures. Built for clinical and high-performance applications, it represents the next level of precision in tPBM technology.',
    price: '',
    priceNote: '',
    cta: 'Get Started',
    checkoutUrl: 'https://buy.stripe.com/cNi4gz8MecJb3Yg7zIe3e02',
    imagePlaceholder: '/main-images/Neuradiant Helmet.png',
  },
  {
    id: 'option-three',
    title: 'QEEG-Driven Protocol Subscription Package',
    productName: 'Personalized Light Therapy for Every Brain.',
    tagline: 'Annual Subscription',
    features: [
      '1 year of unlimited AI-driven tPBM protocols',
      'Unlimited clients',
      'Unlimited QEEG uploads',
      'Personalized tPBM protocols tailored to each client\'s brain activity',
      'Translate brain maps into precise, data-driven light therapy plans',
      'Deliver measurable, individualized results for every client',
      'Strengthen clinical outcomes and reinforce your value as a BrainCore provider',
    ],
    bestFit: 'Upgrade from one-size-fits-all tPBM to QEEG-Driven Protocols—customized light stimulation plans created from each client\'s brain map.',
    price: '',
    priceNote: '',
    cta: 'Learn More',
    checkoutUrl: 'https://buy.stripe.com/aFabJ13rU10tgL24nwe3e00',
    imagePlaceholder: '/main-images/tpbm protocol setting on ios app.webp',
  },
]

export default function Products() {
  const { member, logout, loading: memberLoading } = useMemberstack()
  const router = useRouter()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loadingAvatar, setLoadingAvatar] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showV1Flow, setShowV1Flow] = useState(false)
  const [showV2Flow, setShowV2Flow] = useState(false)

  const formatCurrency = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  const priceV1 = 1795
  const priceV2 = 3395
  const priceV1Disc = priceV1 * 0.9
  const priceV2Disc = priceV2 * 0.9

  // Determine which navigation items to show based on auth state
  const isAuthenticated = !!member
  const navItems = isAuthenticated ? navigation.filter((i) => i.name !== 'Pricing') : navigation
  const showItems = memberLoading ? navigation : navItems

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  // Generate AI avatar for user
  useEffect(() => {
    const generateAvatar = async () => {
      if (!member?.id) {
        setAvatarUrl(null)
        return
      }

      // Check if we already have an avatar cached in localStorage
      const cachedAvatar = localStorage.getItem(`avatar-${member.id}`)
      if (cachedAvatar) {
        setAvatarUrl(cachedAvatar)
        return
      }

      // Generate new avatar
      setLoadingAvatar(true)
      try {
        const response = await fetch('/api/generate-profile-avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: member.id }),
        })

        if (response.ok) {
          const data = await response.json()
          setAvatarUrl(data.imageUrl)
          // Cache the avatar URL
          localStorage.setItem(`avatar-${member.id}`, data.imageUrl)
        }
      } catch (error) {
        console.error('Error generating avatar:', error)
      } finally {
        setLoadingAvatar(false)
      }
    }

    if (!memberLoading) {
      if (member) {
        generateAvatar()
      } else {
        setAvatarUrl(null)
      }
    }
  }, [member, memberLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', location: '', message: '' })
        setTimeout(() => {
          setIsContactModalOpen(false)
          setSubmitStatus('idle')
        }, 2000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Photobiomodulation Solutions | Neuralight Pro</title>
        <meta name="description" content="Choose the right photobiomodulation solution for your neurofeedback practice. At-home options, in-clinic precision tools, and AI-driven protocol subscriptions." />
      </Head>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Disclosure as="nav" className="bg-white/95 backdrop-blur-sm fixed w-full z-50 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex shrink-0 items-center">
                  <Link href="/" className="flex items-center space-x-3">
                    <img 
                      src="/tpbm250.png" 
                      alt="tPBM Protocols Logo" 
                      className="h-10 w-auto"
                    />
                    <span className="text-2xl font-bold" style={{ color: '#4F47E6' }}>
                      tPBM Protocols
                    </span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {showItems.map((item) => (
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
                {!memberLoading && member ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/clients"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      View Dashboard
                    </Link>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push('/profile')}
                        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Profile"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : loadingAvatar ? (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 flex items-center justify-center text-white text-xs font-semibold">
                            {member.customFields?.['first-name']?.charAt(0)?.toUpperCase() || member.customFields?.name?.charAt(0)?.toUpperCase() || member.auth?.email?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <span className="ml-2 text-gray-700 font-medium">
                          {member.customFields?.name || member?.email || member?.auth?.email}
                        </span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="text-xs text-gray-500 hover:text-gray-700 ml-2"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : !memberLoading ? (
                  <>
                    <Link
                      href="/login"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Sign In
                    </Link>

                    <a
                      href="#pricing"
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                    >
                      Get Started
                    </a>
                  </>
                ) : null}
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
              {showItems.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  {item.name}
                </DisclosureButton>
              ))}
              {!memberLoading && member ? (
                <DisclosureButton
                  as="a"
                  href="/clients"
                  className="block border-l-4 border-indigo-600 py-3 pl-3 pr-4 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 mx-3 my-2 rounded-md"
                >
                  📊 Dashboard
                </DisclosureButton>
              ) : !memberLoading ? (
                <>
                  <DisclosureButton
                    as="a"
                    href="/login"
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  >
                    Sign In
                  </DisclosureButton>
                  <DisclosureButton
                    as="a"
                    href="#pricing"
                    className="block border-l-4 border-indigo-600 py-3 pl-3 pr-4 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 mx-3 my-2 rounded-md"
                  >
                    Get Started
                  </DisclosureButton>
                </>
              ) : null}
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* Black Friday Banner */}
        <a
          href="#pricing"
          className="block bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 hover:from-orange-700 hover:via-red-700 hover:to-orange-700 transition-all cursor-pointer fixed top-16 left-0 right-0 z-40"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">🎉</span>
                <span className="text-white font-bold text-base sm:text-lg">
                  Black Friday: Up to 30% OFF + 10% BrainCore Discount Stacked
                </span>
                <span className="text-2xl animate-bounce">🎉</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs sm:text-sm font-semibold text-white border border-white/30">
                Click to View Deals
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        </a>

        {/* New Hero Section - Split Layout with Video */}
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-32">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              {/* Left Side - Content */}
              <div className="w-full lg:w-1/2 order-1 lg:order-1">
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-6xl break-words">
                  QEEG-driven photobiomodulation for better brain health
                </h1>
                <p className="mt-6 text-xl sm:text-2xl leading-8 text-gray-700">
                  Providers, upload your brain map and get instant tPBM protocols.
                </p>

                {/* CTA Buttons - Show on desktop only, positioned here */}
                <div className="hidden lg:flex flex-col sm:flex-row gap-4 mt-10">
                  <a
                    href="#features"
                    className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors text-center"
                  >
                    See How It Works
                  </a>
                  <a
                    href="#pricing"
                    className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-indigo-50 transition-colors text-center"
                  >
                    See Provider Options
                  </a>
                </div>
              </div>

              {/* Video - Positioned between text and buttons on mobile */}
              <div className="relative w-full lg:w-1/2 order-2 lg:order-2">
                <div className="relative w-full pb-[56.25%] rounded-2xl shadow-2xl ring-1 ring-gray-900/10 overflow-hidden bg-gray-900">
                  <div id="video-container" className="absolute top-0 left-0 w-full h-full">
                    {/* Video will be loaded here when thumbnail is clicked */}
                  </div>

                  {/* Custom Thumbnail Overlay */}
                  <div
                    id="video-thumbnail"
                    className="absolute top-0 left-0 w-full h-full cursor-pointer group z-10"
                    onClick={() => {
                      const thumbnail = document.getElementById('video-thumbnail');
                      const container = document.getElementById('video-container');
                      if (thumbnail && container) {
                        // Hide thumbnail
                        thumbnail.style.display = 'none';
                        // Load iframe with autoplay
                        container.innerHTML = `
                          <iframe
                            class="absolute top-0 left-0 w-full h-full border-0"
                            src="https://customer-f57etvnofv3kxoyh.cloudflarestream.com/4ca36ee41542c9962b04eb69e77e4790/iframe?autoplay=true"
                            title="Dr. Guy Annunziata explains QEEG-guided tPBM"
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                            allowfullscreen
                          ></iframe>
                        `;
                      }
                    }}
                  >
                    <img
                      src="/tpbm intro video thumbnail.png"
                      alt="Video thumbnail"
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Thumbnail failed to load');
                        e.currentTarget.style.backgroundColor = '#1f2937';
                      }}
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-200 shadow-xl">
                        <svg className="w-10 h-10 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons - Below video on mobile only */}
              <div className="w-full order-3 lg:hidden">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#features"
                    className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors text-center"
                  >
                    See How It Works
                  </a>
                  <a
                    href="#pricing"
                    className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-indigo-50 transition-colors text-center"
                  >
                    See Provider Options
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why QEEG-Guided tPBM Section */}
        <div id="features" className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left Column - Image */}
              <div className="relative">
                <div className="aspect-square w-full overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src="/main-images/tpbm helmet on desk.png"
                    alt="tPBM helmet on desk"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column - Text */}
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  Precision-Directed Photobiomodulation Starts Here
                </h2>
                <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-700">
                  Traditional photobiomodulation addresses every client the same. BrainCore's QEEG-Driven Protocols change that. Using brain mapping, we identify regions that would benefit from tPBM—then translate that data into customized tPBM stimulation protocols.
                </p>
                <p className="mt-4 text-lg sm:text-xl leading-8 text-gray-700">
                  Whether the goal is improving focus, emotional balance, or stress resilience, this approach delivers truly personalized care that integrates seamlessly with neurofeedback training.
                </p>

                {/* Bullets */}
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                    <span className="ml-3 text-base sm:text-lg text-gray-700">Identifies key brain activity patterns through QEEG</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                    <span className="ml-3 text-base sm:text-lg text-gray-700">Builds personalized, QEEG-Driven tPBM protocols</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                    <span className="ml-3 text-base sm:text-lg text-gray-700">Integrates effortlessly with neurofeedback programs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Built for BrainCore First Section */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left Column - Content Cards */}
              <div>
                <div className="inline-block mb-4 rounded-full bg-indigo-100 px-4 py-2">
                  <p className="text-sm sm:text-base font-semibold text-indigo-900">Exclusive Early Access</p>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl mb-8">
                  Built for BrainCore First
                </h2>

                {/* Card 1 - Exclusive Launch Partner */}
                <div className="mb-6 rounded-xl bg-white p-6 shadow-md ring-1 ring-indigo-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Exclusive Launch Partner</h3>
                      <p className="text-base sm:text-lg text-gray-600">
                        BrainCore providers get first access to our tPBM system—before anyone else. Join the network leading the future of neurofeedback therapy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Seamless Integration */}
                <div className="mb-6 rounded-xl bg-white p-6 shadow-md ring-1 ring-indigo-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Seamless Integration</h3>
                      <p className="text-base sm:text-lg text-gray-600">
                        Designed specifically for BrainCore's workflow—our system integrates directly with your existing QEEG mapping process for effortless protocol generation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Proven Results Faster */}
                <div className="rounded-xl bg-white p-6 shadow-md ring-1 ring-indigo-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Proven Results, Faster</h3>
                      <p className="text-base sm:text-lg text-gray-600">
                        Layer tPBM with your neurofeedback protocols to accelerate patient outcomes. BrainCore providers are already seeing measurable improvements in fewer sessions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Video Embed */}
              <div className="relative w-full">
                <div className="relative w-full pb-[56.25%] rounded-2xl shadow-2xl ring-1 ring-gray-900/10 overflow-hidden bg-gray-900">
                  <div id="braincore-video-container" className="absolute top-0 left-0 w-full h-full">
                    {/* Video will be loaded here when thumbnail is clicked */}
                  </div>

                  {/* Custom Thumbnail Overlay */}
                  <div
                    id="braincore-video-thumbnail"
                    className="absolute top-0 left-0 w-full h-full cursor-pointer group z-10"
                    onClick={() => {
                      const thumbnail = document.getElementById('braincore-video-thumbnail');
                      const container = document.getElementById('braincore-video-container');
                      if (thumbnail && container) {
                        thumbnail.style.display = 'none';
                        container.innerHTML = `
                          <iframe
                            class="absolute top-0 left-0 w-full h-full border-0"
                            src="https://customer-f57etvnofv3kxoyh.cloudflarestream.com/b06223ea6f1d18b5ca1f065ffb62e652/iframe?autoplay=true"
                            title="Built for BrainCore First"
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                            allowfullscreen
                          ></iframe>
                        `;
                      }
                    }}
                  >
                    <img
                      src="/main-images/tpbm BrainCore .png"
                      alt="BrainCore video thumbnail"
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      onError={(e) => {
                        console.error('BrainCore thumbnail failed to load');
                        e.currentTarget.style.backgroundColor = '#1f2937';
                      }}
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-200 shadow-xl">
                        <svg className="w-10 h-10 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="bg-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                How QEEG-Guided tPBM Works
              </h2>
            </div>

            {/* Three-Step Flow */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 shadow-md mb-6">
                  <img
                    src="/main-images/brainmap-square.webp"
                    alt="Upload brain map"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Upload brain map
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600">
                    Download your map report from BrainCore Maps website, and then upload that report into your tPBM account.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 shadow-md mb-6">
                  <img
                    src="/main-images/ai-brain.png"
                    alt="System generating protocol from brain map"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Our system generates your protocol
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600">
                    Protocols generated using advanced metrics combined with functional presentation.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 shadow-md mb-6">
                  <img
                    src="/main-images/tpbm protocol setting on ios app.webp"
                    alt="Custom settings for client"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Get custom settings for the client
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600">
                    The tPBM helmet delivers gentle near-infrared light to specific regions to restore balance and boost performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Results Section */}
        <div id="science" className="relative bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-16 sm:py-24 overflow-hidden">
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            {/* Header - Centered */}
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Real Data. Real Change.
              </h2>
              <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-700">
                By pairing tPBM with neurofeedback, providers see faster progress in focus, mood regulation, and cognitive recovery. The synergy between light-based stimulation and brain self-training produces measurable improvements that clients can feel.
              </p>
            </div>

            {/* Two Column Layout: Image Left, Benefits Right */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Column - Image */}
              <div className="relative lg:mt-32">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gray-900/10 lg:sticky lg:top-32">
                  <img
                    src="/main-images/redlight frm helmet.webp"
                    alt="Red light therapy from tPBM helmet"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column - Benefit Points */}
              <div className="space-y-6">
                <div className="flex gap-4 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md ring-1 ring-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white text-xl font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Enhanced Cerebral Blood Flow
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Increases cerebral blood flow to enhance oxygen and nutrient delivery
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md ring-1 ring-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white text-xl font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Reduced Oxidative Stress
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Reduces oxidative stress by balancing reactive oxygen species
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md ring-1 ring-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white text-xl font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Immune System Support
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Modulates inflammation and supports a healthier immune response
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md ring-1 ring-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white text-xl font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Mitochondrial Activation
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Mitochondrial activation enhances cellular energy production, supporting improved brain function, physical performance, and overall vitality.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md ring-1 ring-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white text-xl font-bold">
                      5
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      Brain Detoxification
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Enhances glymphatic drainage, aiding in brain detoxification and recovery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div id="pricing" className="bg-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Removed standalone flow above pricing per new design */}
            <div className="mx-auto max-w-2xl text-center mb-4">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Choose the tPBM Solution That Fits Your Practice
              </h2>
            </div>

            {/* Black Friday Partner Announcement */}
            <div className="mx-auto max-w-4xl mb-8">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8 shadow-lg ring-2 ring-orange-200">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 opacity-20 blur-2xl"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-center mb-3">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-4 py-1.5 text-sm font-bold text-white shadow-md">
                      🎉 Black Friday Partner Savings
                    </span>
                  </div>
                  
                  <h3 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Stack Your Savings This Black Friday
                  </h3>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                    <p className="text-base sm:text-lg text-gray-800 leading-relaxed text-center mb-4">
                      Neuronic is running their <span className="font-bold text-orange-700">biggest sale of the year</span> with up to <span className="font-bold text-orange-700">30% off</span> select tPBM systems.
                    </p>
                    <p className="text-base sm:text-lg text-gray-800 leading-relaxed text-center mb-4">
                      As an <span className="font-semibold text-indigo-700">official BrainCore partner</span>, you receive an <span className="font-bold text-indigo-700">additional 10% provider discount</span> stacked on top of their Black Friday pricing.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-700 bg-indigo-50 rounded-lg py-3 px-4 border border-indigo-200 mb-6">
                      <svg className="h-5 w-5 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Use code <span className="font-bold">BRAINCORE</span> for an additional 10% off when you order</span>
                    </div>
                    <div className="flex justify-center">
                      <a
                        href="https://www.neuronic.online/black-friday-2025-neuronics-biggest-sale-of-the-year-save-up-to-30-percent"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:from-orange-700 hover:to-red-700 transition-all hover:scale-105"
                      >
                        View Black Friday Sale
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Neuronics Partnership Section */}
            <div className="mx-auto max-w-4xl text-center mb-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-md ring-1 ring-indigo-200">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl mb-3">
                Neuronics tPBM Packages for BrainCore Providers
              </h3>
              <p className="text-lg sm:text-xl font-semibold text-indigo-600 mb-4">
                Precision Brain Stimulation. Exclusive BrainCore Benefits.
              </p>
              <p className="text-base sm:text-lg leading-7 text-gray-700">
                BrainCore is proud to partner with Neuronics to bring providers access to the most advanced transcranial photobiomodulation (tPBM) technology available today—at exclusive, members-only pricing. Each device uses gentle near-infrared light to boost cellular energy, improve circulation, and support overall brain performance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column: Helmet cards stacked */}
              <div className="space-y-8 lg:col-span-2">
                {/* Helmet V1 */}
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-5">
                    <div className="sm:col-span-3 p-6 flex flex-col items-center">
                      <div className="w-full aspect-square overflow-hidden rounded-xl">
                        <img src="/main-images/side view of helmet.jpg" alt="Neuronics Light Package" className="h-full w-full object-cover" />
                      </div>
                      <div className="mt-4 text-center">
                        <div className="text-sm text-gray-400 line-through">{formatCurrency(priceV1)} − 10%</div>
                        <div className="text-xl font-bold text-gray-900">{formatCurrency(priceV1Disc)}</div>
                      </div>
                      <button
                        onClick={() => setShowV1Flow(!showV1Flow)}
                        className="mt-5 inline-block rounded-md bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-orange-700 hover:to-red-700 transition-all"
                      >
                        {showV1Flow ? '✓ View Purchase Steps' : '🎉 Get Black Friday Deal'}
                      </button>
                    </div>
                    <div className="sm:col-span-2 p-6 flex flex-col">
                      <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Neuronics Light Package</p>
                      <h3 className="mt-2 text-2xl font-bold text-gray-900">Affordable. Portable. Powerful.</h3>
                      <p className="mt-1 text-sm text-gray-600">At-Home tPBM System</p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Reliable, full-coverage near-infrared stimulation</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Enhanced cerebral blood flow and mitochondrial activation</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Unlimited client usability</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Direct drop-shipping to your office or patient's home</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Designed for everyday use and simple setup</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Ideal for providers offering patients an affordable at-home training option</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Supports focus, emotional balance, and stress resilience</span></li>
                      </ul>
                      <div className="mt-4 rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">Best Fit</p>
                        <p className="text-sm text-gray-600">Built for BrainCore providers who want to extend care beyond the office. The Light Package delivers consistent, full-coverage stimulation in a compact form—ideal for patients continuing tPBM sessions at home under provider guidance.</p>
                      </div>
                    </div>
                  </div>
                  {showV1Flow && (
                    <div id="flow-v1" className="p-6 border-t border-gray-100">
                      <PurchaseFlow variant="helmet-v1" defaultOpen id="flow-v1" blackFriday={true} />
                      <div className="mt-6">
                        <PurchaseFlow variant="subscription" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Helmet V2 */}
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-5">
                    <div className="sm:col-span-3 p-6 flex flex-col items-center">
                      <div className="w-full aspect-square overflow-hidden rounded-xl">
                        <img src="/main-images/Neuradiant Helmet.png" alt="Neuroradiant 1070 photobiomodulation helmet" className="h-full w-full object-cover" />
                      </div>
                      <div className="mt-4 text-center">
                        <div className="text-sm text-gray-400 line-through">{formatCurrency(priceV2)} − 10%</div>
                        <div className="text-xl font-bold text-gray-900">{formatCurrency(priceV2Disc)}</div>
                      </div>
                      <button
                        onClick={() => setShowV2Flow(!showV2Flow)}
                        aria-label="Purchase Neuroradiant 1070 Helmet"
                        className="mt-5 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
                      >
                        {showV2Flow ? '✓ View Purchase Steps' : 'Get Started'}
                      </button>
                    </div>
                    <div className="sm:col-span-2 p-6 flex flex-col">
                      <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Neuronics Neuroradiant 1070 Package</p>
                      <h3 className="mt-2 text-2xl font-bold text-gray-900">Clinical-Grade Precision. Peak Performance Results.</h3>
                      <p className="mt-1 text-sm text-gray-600">Advanced Clinical-Grade System</p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Research-grade tPBM technology for in-office use</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Targeted 1070 nm near-infrared stimulation reaching deeper brain structures</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Enhanced cerebral blood flow and mitochondrial activation</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Optimized for clinical and high-performance applications</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-700">Engineered for reliability, repeatability, and precision control</span></li>
                      </ul>
                      <div className="mt-4 rounded-lg bg-gray-50 p-4">
                        <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">Best Fit</p>
                        <p className="text-sm text-gray-600">Designed for clinical environments that demand the highest level of precision. The Neuroradiant 1070 enables targeted, data-driven stimulation to support brain recovery, performance optimization, and advanced neurofeedback integration.</p>
                      </div>
                    </div>
                  </div>
                  {showV2Flow && (
                    <div id="flow-v2" className="p-6 border-t border-gray-100">
                      <PurchaseFlow variant="helmet-v2" defaultOpen id="flow-v2" />
                      <div className="mt-6">
                        <PurchaseFlow variant="subscription" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column: Subscription */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 self-start bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden flex flex-col">
                  <img src="/main-images/tpbm protocol setting on ios app.webp" alt="Subscription" className="h-40 w-full object-cover" />
                  <div className="p-5 flex flex-col">
                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">QEEG-Driven Protocol Subscription Package</p>
                    <h3 className="mt-2 text-2xl font-bold text-gray-900">Activate Your Plan</h3>
                    <p className="mt-3 text-sm text-gray-600">Choose monthly or annual subscription for unlimited QEEG uploads to generate fully personalized tPBM protocols. Unlimited clients and continuous protocol updates.</p>
                    
                    {/* Pricing Options */}
                    <div className="mt-6 space-y-3">
                      {/* Monthly Option */}
                      <div className="rounded-lg border-2 border-gray-300 p-4 hover:border-indigo-500 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Monthly Plan</p>
                            <p className="text-xs text-gray-500">Pay as you go</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">$40<span className="text-sm font-normal text-gray-500">/mo</span></p>
                        </div>
                        <a 
                          href="https://buy.stripe.com/4gMaEX0fI7oReCU1bke3e03" 
                          className="block w-full text-center rounded-md bg-white border-2 border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          Subscribe Monthly
                        </a>
                      </div>
                      
                      {/* Annual Option */}
                      <div className="rounded-lg border-2 border-indigo-600 p-4 bg-indigo-50 relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                            BEST VALUE - Save $80
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2 mt-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Annual Plan</p>
                            <p className="text-xs text-gray-600">Save 2 months</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">$400<span className="text-sm font-normal text-gray-500">/yr</span></p>
                        </div>
                        <a 
                          href="https://buy.stripe.com/9B63cv0fI24x0M4g6ee3e04" 
                          className="block w-full text-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                          Subscribe Annually
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FAQ/Support Section */}
        <div className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Not sure which option is right for you?
            </h2>
            <div className="mt-10">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Mini FAQ Section */}
          <div className="mx-auto max-w-4xl px-6 lg:px-8 mt-16">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-8 shadow-lg ring-1 ring-indigo-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Why Offer Neuronics tPBM Through BrainCore?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                  <div className="ml-3">
                    <span className="font-semibold text-gray-900">Exclusive Provider Pricing</span>
                    <span className="text-gray-700"> – Save 10% on every device with code BrainCore</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                  <div className="ml-3">
                    <span className="font-semibold text-gray-900">Seamless Fulfillment</span>
                    <span className="text-gray-700"> – Direct shipping to your practice or clients</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                  <div className="ml-3">
                    <span className="font-semibold text-gray-900">Revenue Growth</span>
                    <span className="text-gray-700"> – Earn profits on every helmet sold</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                  <div className="ml-3">
                    <span className="font-semibold text-gray-900">Personalized Care</span>
                    <span className="text-gray-700"> – Enhance neurofeedback outcomes with QEEG-driven customization</span>
                  </div>
                </li>
              </ul>
              <p className="mt-8 text-center text-lg font-semibold text-gray-900">
                Empower your patients. Expand your practice.
              </p>
              <p className="mt-2 text-center text-base text-gray-700">
                With BrainCore + Neuronics, you can combine the power of light and data to deliver truly personalized brain health solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Product Comparison Table */}
        <div className="bg-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Neuronics tPBM Package Comparison
            </h3>
            
            {/* Mobile Accordion View */}
            <div className="sm:hidden space-y-3">
              {/* Neuronics Light Package */}
              <Disclosure>
                {({ open }) => (
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <DisclosureButton className="flex w-full items-center justify-between px-4 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-md flex-shrink-0">
                          <img src="/main-images/side view of helmet.jpg" alt="Neuronics Light helmet" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-base font-semibold text-gray-900">Neuronics Light Package</span>
                      </div>
                      <ChevronDownIcon className={`h-5 w-5 text-indigo-600 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </DisclosureButton>
                    <DisclosurePanel className="px-4 pb-4 pt-2 space-y-4 border-t border-gray-100">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                        <p className="text-sm text-gray-600">Affordable at-home tPBM system delivering reliable, full-coverage near‑infrared stimulation.</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Includes</h4>
                        <div className="space-y-2">
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">Unlimited client usability</span></div>
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">Direct drop‑shipping to office or patient's home</span></div>
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">Designed for everyday use and simple setup</span></div>
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">Full‑coverage stimulation across the scalp</span></div>
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">Enhanced cerebral blood flow and mitochondrial activation</span></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Best For</h4>
                        <p className="text-sm text-gray-600">Built for BrainCore providers who want to extend care beyond the office—ideal for patients continuing tPBM sessions at home under provider guidance.</p>
                      </div>
                    </DisclosurePanel>
                  </div>
                )}
              </Disclosure>

              {/* Neuronics Neuroradiant 1070 Package */}
              <Disclosure>
                {({ open }) => (
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <DisclosureButton className="flex w-full items-center justify-between px-4 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-md flex-shrink-0">
                          <img src="/main-images/Neuradiant Helmet.png" alt="Neuroradiant 1070 helmet" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-base font-semibold text-gray-900">Neuronics Neuroradiant 1070 Package</span>
                      </div>
                      <ChevronDownIcon className={`h-5 w-5 text-indigo-600 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </DisclosureButton>
                    <DisclosurePanel className="px-4 pb-4 pt-2 space-y-4 border-t border-gray-100">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                        <p className="text-sm text-gray-600">Advanced clinical‑grade system featuring targeted 1070 nm near‑infrared for deeper brain stimulation.</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Includes</h4>
                        <div className="space-y-2">
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">Research‑grade tPBM for in‑office use</span></div>
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">Targeted 1070 nm stimulation reaching deeper structures</span></div>
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">Enhanced cerebral blood flow and mitochondrial activation</span></div>
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">Engineered for reliability, repeatability, and precision control</span></div>
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">4‑Quadrant control with precision targeting</span></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Best For</h4>
                        <p className="text-sm text-gray-600">Designed for clinical environments that demand the highest precision—brain recovery, performance optimization, and advanced neurofeedback integration.</p>
                      </div>
                    </DisclosurePanel>
                  </div>
                )}
              </Disclosure>

              {/* QEEG-Driven Protocol Subscription Package */}
              <Disclosure>
                {({ open }) => (
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <DisclosureButton className="flex w-full items-center justify-between px-4 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-md flex-shrink-0">
                          <img src="/main-images/tpbm protocol setting on ios app.webp" alt="Subscription app" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-base font-semibold text-gray-900">QEEG‑Driven Protocol Subscription Package</span>
                      </div>
                      <ChevronDownIcon className={`h-5 w-5 text-indigo-600 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </DisclosureButton>
                    <DisclosurePanel className="px-4 pb-4 pt-2 space-y-4 border-t border-gray-100">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                        <p className="text-sm text-gray-600">Annual subscription that generates fully personalized tPBM protocols from unlimited QEEG uploads.</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Includes</h4>
                        <div className="space-y-2">
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">Unlimited QEEG uploads</span></div>
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">Unlimited clients</span></div>
                          <div className="flex items-start"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0 mt-0.5" /><span className="text-sm text-gray-600">All protocol updates included</span></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Best For</h4>
                        <p className="text-sm text-gray-600">Clinics offering customized, data‑driven light therapy tailored to each client.</p>
                      </div>
                    </DisclosurePanel>
                  </div>
                )}
              </Disclosure>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto shadow-lg rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-indigo-600">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white">
                      
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Package
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Includes
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Best For
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 overflow-hidden rounded-md">
                        <img src="/main-images/side view of helmet.jpg" alt="Neuronics Light helmet" className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Neuronics Light Package</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Affordable at-home tPBM system delivering reliable, full-coverage near‑infrared stimulation.</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="space-y-1">
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>Unlimited client usability</span></div>
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>Direct drop‑shipping to office or patient's home</span></div>
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>Designed for everyday use and simple setup</span></div>
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>Full‑coverage stimulation across the scalp</span></div>
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>Enhanced cerebral blood flow and mitochondrial activation</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">Built for BrainCore providers who want to extend care beyond the office—ideal for patients continuing tPBM sessions at home under provider guidance.</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 overflow-hidden rounded-md">
                        <img src="/main-images/Neuradiant Helmet.png" alt="Neuroradiant 1070 helmet" className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Neuronics Neuroradiant 1070 Package</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Advanced clinical‑grade system featuring targeted 1070 nm near‑infrared for deeper brain stimulation.</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="space-y-1">
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>Research‑grade tPBM for in‑office use</span></div>
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>Targeted 1070 nm stimulation reaching deeper structures</span></div>
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>Enhanced cerebral blood flow and mitochondrial activation</span></div>
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>Engineered for reliability, repeatability, and precision control</span></div>
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>4‑Quadrant control with precision targeting</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">Designed for clinical environments that demand the highest precision—brain recovery, performance optimization, and advanced neurofeedback integration.</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 overflow-hidden rounded-md">
                        <img src="/main-images/tpbm protocol setting on ios app.webp" alt="Subscription app" className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">QEEG‑Driven Protocol Subscription Package</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Annual subscription that generates fully personalized tPBM protocols from unlimited QEEG uploads.</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="space-y-1">
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>Unlimited QEEG uploads</span></div>
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>Unlimited clients</span></div>
                        <div className="flex items-center"><CheckIcon className="h-4 w-4 text-indigo-600 mr-2 shrink-0" /><span>All protocol updates included</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">Clinics offering customized, data‑driven light therapy tailored to each client.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-700">
          <div className="px-6 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to elevate your practice?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
                Use code <span className="font-bold text-white">BrainCore</span> to access exclusive provider pricing and start delivering precision, data-driven brain health solutions.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#pricing"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get Started Today
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        <Dialog open={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="mx-auto max-w-lg w-full bg-white rounded-2xl shadow-2xl">
              <div className="p-8">
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Get in Touch
                </DialogTitle>
                <p className="text-gray-600 mb-6">
                  Tell us about your practice and we'll get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                      placeholder="Dr. John Smith"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Location Field */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                      placeholder="City, State"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border resize-none"
                      placeholder="Tell us about your practice and what you're looking for..."
                    />
                  </div>

                  {/* Submit Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="rounded-md bg-green-50 p-4">
                      <p className="text-sm font-medium text-green-800">
                        Message sent successfully! We'll be in touch soon.
                      </p>
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="rounded-md bg-red-50 p-4">
                      <p className="text-sm font-medium text-red-800">
                        Something went wrong. Please try again or email us directly at emil@thankyuu.com
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsContactModalOpen(false)}
                      className="flex-1 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}
