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

function TranslationOverlay() {
  const [text, setText] = useState('')
  const [translation, setTranslation] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTranslate = async (textToTranslate: string) => {
    if (!textToTranslate) {
      setTranslation('')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToTranslate })
      })
      const data = await res.json()
      setTranslation(data.translatedText)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Effect to translate instantly as user types (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleTranslate(text)
    }, 500)
    return () => clearTimeout(timer)
  }, [text])

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 p-4 bg-[#0B162A]/95 backdrop-blur shadow-2xl rounded-xl border-2 border-[#C83803] w-80">
        <h3 className="font-bold text-white mb-2">Instant French Translator</h3>
        <textarea
          className="w-full p-2 border border-[#C83803] rounded mb-2 text-sm text-[#0B162A] bg-white focus:border-[#C83803] focus:ring-[#C83803]"
          rows={3}
          placeholder="Type text to overlay..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {loading && <p className="text-xs text-[#C83803]">Translating...</p>}
        {translation && (
          <div className="mt-2 p-2 bg-white/10 rounded border border-[#C83803]/30">
            <p className="text-sm font-medium text-[#C83803]">{translation}</p>
          </div>
        )}
      </div>
      
      {/* Overlay Display */}
      {translation && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100]">
           <h1 className="text-6xl font-black text-[#C83803] drop-shadow-[0_4px_4px_rgba(11,22,42,0.8)] text-center px-4 leading-tight bg-[#0B162A]/80 backdrop-blur-sm p-8 rounded-3xl border-4 border-[#C83803]">
             {translation}
           </h1>
        </div>
      )}
    </>
  )
}

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
  const [hoveredText, setHoveredText] = useState<string | null>(null)
  const [hoverTranslation, setHoverTranslation] = useState<string | null>(null)

  // Handle text hover for translation
  useEffect(() => {
    const handleMouseOver = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Only translate significant text blocks
      if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'SPAN', 'A'].includes(target.tagName) && target.textContent) {
        const text = target.textContent.trim()
        if (text.length > 3) { // Skip very short text
          setHoveredText(text)
          
          try {
            const res = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text })
            })
            const data = await res.json()
            setHoverTranslation(data.translatedText)
          } catch (error) {
            console.error('Translation error', error)
          }
        }
      }
    }

    const handleMouseOut = () => {
      setHoveredText(null)
      setHoverTranslation(null)
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

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
        body {
          background-color: #0B162A;
          color: white;
        }
      `}</style>
      
      {/* Translation Overlay Component */}
      <TranslationOverlay />

      {/* Hover Translation Tooltip */}
      {hoverTranslation && (
        <div 
          className="fixed z-[9999] pointer-events-none bg-[#C83803] text-white px-4 py-2 rounded-lg shadow-xl text-lg font-bold border-2 border-white transform -translate-x-1/2 -translate-y-full mt-[-10px]"
          style={{ 
            left: '50%', 
            top: '10%', // Position at top center for visibility, or track mouse position for true tooltip
            position: 'fixed'
          }}
        >
          {hoverTranslation}
        </div>
      )}

      <div className="min-h-screen bg-[#0B162A]">
        {/* Navigation */}
        <Disclosure as="nav" className="bg-[#0B162A]/95 backdrop-blur-sm fixed w-full z-50 shadow-sm border-b border-[#C83803]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex shrink-0 items-center">
                  <Link href="/" className="flex items-center space-x-3">
                    <img 
                      src="/tpbm250.png" 
                      alt="tPBM Protocols Logo" 
                      className="h-10 w-auto brightness-0 invert"
                    />
                    <span className="text-2xl font-bold text-white">
                      tPBM Protocols
                    </span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {showItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-[#C83803] hover:text-[#C83803] transition-colors"
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
                      className="text-sm font-medium text-gray-300 hover:text-white"
                    >
                      View Dashboard
                    </Link>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push('/profile')}
                        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C83803]"
                      >
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Profile"
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-[#C83803]"
                          />
                        ) : loadingAvatar ? (
                          <div className="h-8 w-8 rounded-full bg-[#C83803] animate-pulse" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-[#C83803] flex items-center justify-center text-white text-xs font-semibold">
                            {member.customFields?.['first-name']?.charAt(0)?.toUpperCase() || member.customFields?.name?.charAt(0)?.toUpperCase() || member.auth?.email?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <span className="ml-2 text-gray-300 font-medium">
                          {member.customFields?.name || member?.email || member?.auth?.email}
                        </span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="text-xs text-gray-400 hover:text-white ml-2"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : !memberLoading ? (
                  <>
                    <Link
                      href="/login"
                      className="text-sm font-medium text-gray-300 hover:text-white"
                    >
                      Sign In
                    </Link>

                    <a
                      href="#pricing"
                      className="rounded-md bg-[#C83803] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-white hover:text-[#0B162A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83803] transition-all"
                    >
                      Get Started
                    </a>
                  </>
                ) : null}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-[#C83803] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>
          <DisclosurePanel className="sm:hidden bg-[#0B162A] border-t border-[#C83803]">
            <div className="space-y-1 pb-3 pt-2">
              {showItems.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-[#C83803] hover:bg-[#0B162A]/50 hover:text-white"
                >
                  {item.name}
                </DisclosureButton>
              ))}
              {!memberLoading && member ? (
                <DisclosureButton
                  as="a"
                  href="/clients"
                  className="block border-l-4 border-[#C83803] py-3 pl-3 pr-4 text-lg font-bold text-white bg-[#C83803]/20 hover:bg-[#C83803]/40 mx-3 my-2 rounded-md"
                >
                  📊 Dashboard
                </DisclosureButton>
              ) : !memberLoading ? (
                <>
                  <DisclosureButton
                    as="a"
                    href="/login"
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-[#C83803] hover:bg-[#0B162A]/50 hover:text-white"
                  >
                    Sign In
                  </DisclosureButton>
                  <DisclosureButton
                    as="a"
                    href="#pricing"
                    className="block border-l-4 border-[#C83803] py-3 pl-3 pr-4 text-lg font-bold text-white bg-[#C83803] hover:bg-white hover:text-[#0B162A] mx-3 my-2 rounded-md transition-colors"
                  >
                    Get Started
                  </DisclosureButton>
                </>
              ) : null}
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* New Hero Section - Split Layout with Video */}
        <div className="relative bg-[#0B162A] pt-16 border-b-4 border-[#C83803]">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              {/* Left Side - Content */}
              <div className="w-full lg:w-1/2 order-1 lg:order-1">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-6xl break-words drop-shadow-lg">
                  <span className="text-[#C83803]">QEEG-driven</span> photobiomodulation for better brain health
                </h1>
                <p className="mt-6 text-xl sm:text-2xl leading-8 text-gray-300">
                  Providers, upload your brain map and get instant tPBM protocols.
                </p>

                {/* CTA Buttons - Show on desktop only, positioned here */}
                <div className="hidden lg:flex flex-col sm:flex-row gap-4 mt-10">
                  <a
                    href="#features"
                    className="rounded-md bg-[#C83803] px-6 py-3 text-lg font-bold text-white shadow-[0_0_15px_rgba(200,56,3,0.5)] hover:bg-white hover:text-[#0B162A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83803] transition-all uppercase tracking-wide"
                  >
                    See How It Works
                  </a>
                  <a
                    href="#pricing"
                    className="rounded-md bg-transparent border-2 border-white px-6 py-3 text-lg font-bold text-white shadow-sm hover:bg-white hover:text-[#0B162A] transition-all uppercase tracking-wide"
                  >
                    See Provider Options
                  </a>
                </div>
              </div>

              {/* Video - Positioned between text and buttons on mobile */}
              <div className="relative w-full lg:w-1/2 order-2 lg:order-2">
                <div className="relative w-full pb-[56.25%] rounded-2xl shadow-2xl ring-4 ring-[#C83803] overflow-hidden bg-black">
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
                      className="absolute top-0 left-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        console.error('Thumbnail failed to load');
                        e.currentTarget.style.backgroundColor = '#1f2937';
                      }}
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-24 h-24 rounded-full bg-[#C83803]/90 flex items-center justify-center group-hover:bg-[#C83803] group-hover:scale-110 transition-all duration-200 shadow-xl border-4 border-white">
                        <svg className="w-12 h-12 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
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
                    className="rounded-md bg-[#C83803] px-6 py-3 text-lg font-bold text-white shadow-lg hover:bg-white hover:text-[#0B162A] transition-all text-center uppercase"
                  >
                    See How It Works
                  </a>
                  <a
                    href="#pricing"
                    className="rounded-md bg-transparent border-2 border-white px-6 py-3 text-lg font-bold text-white shadow-sm hover:bg-white hover:text-[#0B162A] transition-colors text-center uppercase"
                  >
                    See Provider Options
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why QEEG-Guided tPBM Section */}
        <div id="features" className="bg-[#0B162A] py-16 sm:py-24 border-b border-[#C83803]/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left Column - Image */}
              <div className="relative">
                <div className="aspect-square w-full overflow-hidden rounded-2xl shadow-2xl ring-2 ring-[#C83803]">
                  <img
                    src="/main-images/tpbm helmet on desk.png"
                    alt="tPBM helmet on desk"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column - Text */}
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Precision-Directed Photobiomodulation Starts Here
                </h2>
                <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-300">
                  Traditional photobiomodulation addresses every client the same. BrainCore's QEEG-Driven Protocols change that. Using brain mapping, we identify regions that would benefit from tPBM—then translate that data into customized tPBM stimulation protocols.
                </p>
                <p className="mt-4 text-lg sm:text-xl leading-8 text-gray-300">
                  Whether the goal is improving focus, emotional balance, or stress resilience, this approach delivers truly personalized care that integrates seamlessly with neurofeedback training.
                </p>

                {/* Bullets */}
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-[#C83803] shrink-0 mt-1" />
                    <span className="ml-3 text-base sm:text-lg text-gray-200">Identifies key brain activity patterns through QEEG</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-[#C83803] shrink-0 mt-1" />
                    <span className="ml-3 text-base sm:text-lg text-gray-200">Builds personalized, QEEG-Driven tPBM protocols</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-[#C83803] shrink-0 mt-1" />
                    <span className="ml-3 text-base sm:text-lg text-gray-200">Integrates effortlessly with neurofeedback programs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Built for BrainCore First Section */}
        <div className="bg-[#0B162A] py-16 sm:py-24 relative overflow-hidden">
          {/* Bears stripe background */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(135deg, #C83803 25%, transparent 25%, transparent 50%, #C83803 50%, #C83803 75%, transparent 75%, transparent 100%)`,
            backgroundSize: '20px 20px'
          }}></div>
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left Column - Content Cards */}
              <div>
                <div className="inline-block mb-4 rounded-full bg-[#C83803] px-4 py-2">
                  <p className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">Exclusive Early Access</p>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-8">
                  Built for BrainCore First
                </h2>

                {/* Card 1 - Exclusive Launch Partner */}
                <div className="mb-6 rounded-xl bg-[#0B162A] border border-[#C83803]/30 p-6 shadow-lg hover:border-[#C83803] transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C83803]">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Exclusive Launch Partner</h3>
                      <p className="text-base sm:text-lg text-gray-300">
                        BrainCore providers get first access to our tPBM system—before anyone else. Join the network leading the future of neurofeedback therapy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Seamless Integration */}
                <div className="mb-6 rounded-xl bg-[#0B162A] border border-[#C83803]/30 p-6 shadow-lg hover:border-[#C83803] transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C83803]">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Seamless Integration</h3>
                      <p className="text-base sm:text-lg text-gray-300">
                        Designed specifically for BrainCore's workflow—our system integrates directly with your existing QEEG mapping process for effortless protocol generation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Proven Results Faster */}
                <div className="rounded-xl bg-[#0B162A] border border-[#C83803]/30 p-6 shadow-lg hover:border-[#C83803] transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C83803]">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Proven Results, Faster</h3>
                      <p className="text-base sm:text-lg text-gray-300">
                        Layer tPBM with your neurofeedback protocols to accelerate patient outcomes. BrainCore providers are already seeing measurable improvements in fewer sessions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Video Embed */}
              <div className="relative w-full">
                <div className="relative w-full pb-[56.25%] rounded-2xl shadow-2xl ring-4 ring-[#C83803] overflow-hidden bg-black">
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
                      className="absolute top-0 left-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        console.error('BrainCore thumbnail failed to load');
                        e.currentTarget.style.backgroundColor = '#1f2937';
                      }}
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-24 h-24 rounded-full bg-[#C83803]/90 flex items-center justify-center group-hover:bg-[#C83803] group-hover:scale-110 transition-all duration-200 shadow-xl border-4 border-white">
                        <svg className="w-12 h-12 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
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
        <div id="how-it-works" className="bg-[#0B162A] py-16 sm:py-24 border-t border-b border-[#C83803]/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                How QEEG-Guided tPBM Works
              </h2>
            </div>

            {/* Three-Step Flow */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
              {/* Step 1 */}
              <div className="relative group">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-800 shadow-md mb-6 ring-2 ring-[#C83803]/50 group-hover:ring-[#C83803] transition-all">
                  <img
                    src="/main-images/brainmap-square.webp"
                    alt="Upload brain map"
                    className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C83803] text-white text-xl font-bold mb-4 shadow-[0_0_10px_rgba(200,56,3,0.5)]">
                    1
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Upload brain map
                  </h3>
                  <p className="text-base sm:text-lg text-gray-300">
                    Download your map report from BrainCore Maps website, and then upload that report into your tPBM account.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-800 shadow-md mb-6 ring-2 ring-[#C83803]/50 group-hover:ring-[#C83803] transition-all">
                  <img
                    src="/main-images/ai-brain.png"
                    alt="System generating protocol from brain map"
                    className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C83803] text-white text-xl font-bold mb-4 shadow-[0_0_10px_rgba(200,56,3,0.5)]">
                    2
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Our system generates your protocol
                  </h3>
                  <p className="text-base sm:text-lg text-gray-300">
                    Protocols generated using advanced metrics combined with functional presentation.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-800 shadow-md mb-6 ring-2 ring-[#C83803]/50 group-hover:ring-[#C83803] transition-all">
                  <img
                    src="/main-images/tpbm protocol setting on ios app.webp"
                    alt="Custom settings for client"
                    className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C83803] text-white text-xl font-bold mb-4 shadow-[0_0_10px_rgba(200,56,3,0.5)]">
                    3
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Get custom settings for the client
                  </h3>
                  <p className="text-base sm:text-lg text-gray-300">
                    The tPBM helmet delivers gentle near-infrared light to specific regions to restore balance and boost performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Results Section */}
        <div id="science" className="relative bg-[#0B162A] py-16 sm:py-24 overflow-hidden">
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            {/* Header - Centered */}
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Real Data. Real Change.
              </h2>
              <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-300">
                By pairing tPBM with neurofeedback, providers see faster progress in focus, mood regulation, and cognitive recovery. The synergy between light-based stimulation and brain self-training produces measurable improvements that clients can feel.
              </p>
            </div>

            {/* Two Column Layout: Image Left, Benefits Right */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Column - Image */}
              <div className="relative lg:mt-32">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl ring-4 ring-[#C83803] lg:sticky lg:top-32">
                  <img
                    src="/main-images/redlight frm helmet.webp"
                    alt="Red light therapy from tPBM helmet"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column - Benefit Points */}
              <div className="space-y-6">
                {[
                  {
                    title: 'Enhanced Cerebral Blood Flow',
                    desc: 'Increases cerebral blood flow to enhance oxygen and nutrient delivery'
                  },
                  {
                    title: 'Reduced Oxidative Stress',
                    desc: 'Reduces oxidative stress by balancing reactive oxygen species'
                  },
                  {
                    title: 'Immune System Support',
                    desc: 'Modulates inflammation and supports a healthier immune response'
                  },
                  {
                    title: 'Mitochondrial Activation',
                    desc: 'Mitochondrial activation enhances cellular energy production, supporting improved brain function, physical performance, and overall vitality.'
                  },
                  {
                    title: 'Brain Detoxification',
                    desc: 'Enhances glymphatic drainage, aiding in brain detoxification and recovery'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 bg-[#0B162A] border border-[#C83803]/30 rounded-xl p-6 shadow-md hover:border-[#C83803] hover:shadow-[0_0_15px_rgba(200,56,3,0.2)] transition-all">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C83803] text-white text-xl font-bold shadow-lg">
                        {idx + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div id="pricing" className="bg-[#0B162A] py-16 sm:py-24 border-t border-[#C83803]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Removed standalone flow above pricing per new design */}
            <div className="mx-auto max-w-2xl text-center mb-4">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Choose the tPBM Solution That Fits Your Practice
              </h2>
            </div>

            {/* Neuronics Partnership Section */}
            <div className="mx-auto max-w-4xl text-center mb-12 rounded-2xl bg-[#0B162A] border-2 border-[#C83803] p-8 shadow-[0_0_20px_rgba(200,56,3,0.2)]">
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl mb-3">
                Neuronics tPBM Packages for BrainCore Providers
              </h3>
              <p className="text-lg sm:text-xl font-bold text-[#C83803] mb-4">
                Precision Brain Stimulation. Exclusive BrainCore Benefits.
              </p>
              <p className="text-base sm:text-lg leading-7 text-gray-300">
                BrainCore is proud to partner with Neuronics to bring providers access to the most advanced transcranial photobiomodulation (tPBM) technology available today—at exclusive, members-only pricing. Each device uses gentle near-infrared light to boost cellular energy, improve circulation, and support overall brain performance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column: Helmet cards stacked */}
              <div className="space-y-8 lg:col-span-2">
                {/* Helmet V1 */}
                <div className="bg-[#0B162A] rounded-2xl shadow-xl border border-[#C83803]/50 overflow-hidden hover:border-[#C83803] transition-colors">
                  <div className="grid grid-cols-1 sm:grid-cols-5">
                    <div className="sm:col-span-3 p-6 flex flex-col items-center border-r border-[#C83803]/20">
                      <div className="w-full aspect-square overflow-hidden rounded-xl border border-[#C83803]/30">
                        <img src="/main-images/side view of helmet.jpg" alt="Neuronics Light Package" className="h-full w-full object-cover" />
                      </div>
                      <div className="mt-4 text-center">
                        <div className="text-sm text-gray-400 line-through">{formatCurrency(priceV1)} − 10%</div>
                        <div className="text-xl font-bold text-[#C83803]">{formatCurrency(priceV1Disc)}</div>
                      </div>
                      <button
                        onClick={() => {
                          setShowV1Flow(true)
                          setTimeout(() => {
                            const el = document.getElementById('flow-v1')
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }, 0)
                        }}
                        className="mt-5 rounded-md bg-[#C83803] px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-white hover:text-[#0B162A] transition-all uppercase tracking-wide w-full"
                      >
                        Buy Neuronics LIGHT
                      </button>
                    </div>
                    <div className="sm:col-span-2 p-6 flex flex-col">
                      <p className="text-sm font-bold text-[#C83803] uppercase tracking-wide">Neuronics Light Package</p>
                      <h3 className="mt-2 text-2xl font-bold text-white">Affordable. Portable. Powerful.</h3>
                      <p className="mt-1 text-sm text-gray-400">At-Home tPBM System</p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-[#C83803] mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-300">Reliable, full-coverage near-infrared stimulation</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-[#C83803] mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-300">Enhanced cerebral blood flow and mitochondrial activation</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-[#C83803] mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-300">Unlimited client usability</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-[#C83803] mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-300">Direct drop-shipping to your office or patient's home</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-[#C83803] mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-300">Designed for everyday use and simple setup</span></li>
                      </ul>
                      <div className="mt-4 rounded-lg bg-white/5 p-4 border border-white/10">
                        <p className="text-xs font-bold text-white uppercase tracking-wide mb-2">Best Fit</p>
                        <p className="text-sm text-gray-300">Built for BrainCore providers who want to extend care beyond the office.</p>
                      </div>
                    </div>
                  </div>
                  {showV1Flow && (
                    <div id="flow-v1" className="p-6 border-t border-[#C83803]/30 bg-white/5">
                      <PurchaseFlow variant="helmet-v1" defaultOpen id="flow-v1" />
                      <div className="mt-6">
                        <PurchaseFlow variant="subscription" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Helmet V2 */}
                <div className="bg-[#0B162A] rounded-2xl shadow-xl border border-[#C83803]/50 overflow-hidden hover:border-[#C83803] transition-colors">
                  <div className="grid grid-cols-1 sm:grid-cols-5">
                    <div className="sm:col-span-3 p-6 flex flex-col items-center border-r border-[#C83803]/20">
                      <div className="w-full aspect-square overflow-hidden rounded-xl border border-[#C83803]/30">
                        <img src="/main-images/Neuradiant Helmet.png" alt="Neuroradiant 1070 photobiomodulation helmet" className="h-full w-full object-cover" />
                      </div>
                      <div className="mt-4 text-center">
                        <div className="text-sm text-gray-400 line-through">{formatCurrency(priceV2)} − 10%</div>
                        <div className="text-xl font-bold text-[#C83803]">{formatCurrency(priceV2Disc)}</div>
                      </div>
                      <button
                        aria-label="Buy Neuroradiant 1070 Helmet"
                        onClick={() => {
                          setShowV2Flow(true)
                          setTimeout(() => {
                            const el = document.getElementById('flow-v2')
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }, 0)
                        }}
                        className="mt-5 rounded-md bg-[#C83803] px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-white hover:text-[#0B162A] transition-all uppercase tracking-wide w-full"
                      >
                        Buy Neuradiant 1070
                      </button>
                    </div>
                    <div className="sm:col-span-2 p-6 flex flex-col">
                      <p className="text-sm font-bold text-[#C83803] uppercase tracking-wide">Neuronics Neuroradiant 1070 Package</p>
                      <h3 className="mt-2 text-2xl font-bold text-white">Clinical-Grade Precision. Peak Performance Results.</h3>
                      <p className="mt-1 text-sm text-gray-400">Advanced Clinical-Grade System</p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-[#C83803] mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-300">Research-grade tPBM technology for in-office use</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-[#C83803] mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-300">Targeted 1070 nm near-infrared stimulation reaching deeper brain structures</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-[#C83803] mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-300">Enhanced cerebral blood flow and mitochondrial activation</span></li>
                        <li className="flex items-start"><CheckIcon className="h-5 w-5 text-[#C83803] mt-0.5" aria-hidden="true" /><span className="ml-3 text-sm text-gray-300">Optimized for clinical and high-performance applications</span></li>
                      </ul>
                      <div className="mt-4 rounded-lg bg-white/5 p-4 border border-white/10">
                        <p className="text-xs font-bold text-white uppercase tracking-wide mb-2">Best Fit</p>
                        <p className="text-sm text-gray-300">Designed for clinical environments that demand the highest level of precision.</p>
                      </div>
                    </div>
                  </div>
                  {showV2Flow && (
                    <div id="flow-v2" className="p-6 border-t border-[#C83803]/30 bg-white/5">
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
                <div className="lg:sticky lg:top-24 self-start bg-[#0B162A] rounded-2xl shadow-xl border border-[#C83803]/50 overflow-hidden flex flex-col hover:border-[#C83803] transition-colors">
                  <img src="/main-images/tpbm protocol setting on ios app.webp" alt="Subscription" className="h-40 w-full object-cover" />
                  <div className="p-5 flex flex-col">
                    <p className="text-sm font-bold text-[#C83803] uppercase tracking-wide">QEEG-Driven Protocol Subscription Package</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">Activate Your Plan</h3>
                    <p className="mt-3 text-sm text-gray-300">Choose monthly or annual subscription for unlimited QEEG uploads to generate fully personalized tPBM protocols.</p>
                    
                    {/* Pricing Options */}
                    <div className="mt-6 space-y-3">
                      {/* Monthly Option */}
                      <div className="rounded-lg border-2 border-gray-600 p-4 hover:border-[#C83803] transition-colors bg-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-white">Monthly Plan</p>
                            <p className="text-xs text-gray-400">Pay as you go</p>
                          </div>
                          <p className="text-2xl font-bold text-white">$40<span className="text-sm font-normal text-gray-400">/mo</span></p>
                        </div>
                        <a 
                          href="https://buy.stripe.com/4gMaEX0fI7oReCU1bke3e03" 
                          className="block w-full text-center rounded-md border-2 border-[#C83803] px-4 py-2 text-sm font-bold text-[#C83803] hover:bg-[#C83803] hover:text-white transition-colors uppercase"
                        >
                          Subscribe Monthly
                        </a>
                      </div>
                      
                      {/* Annual Option */}
                      <div className="rounded-lg border-2 border-[#C83803] p-4 bg-[#C83803]/10 relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-[#C83803] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                            BEST VALUE - Save $80
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2 mt-2">
                          <div>
                            <p className="text-sm font-medium text-white">Annual Plan</p>
                            <p className="text-xs text-gray-300">Save 2 months</p>
                          </div>
                          <p className="text-2xl font-bold text-white">$400<span className="text-sm font-normal text-gray-300">/yr</span></p>
                        </div>
                        <a 
                          href="https://buy.stripe.com/9B63cv0fI24x0M4g6ee3e04" 
                          className="block w-full text-center rounded-md bg-[#C83803] px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-white hover:text-[#0B162A] transition-colors uppercase"
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
        <div className="bg-[#0B162A] py-16 sm:py-24 border-t border-[#C83803]/30">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Not sure which option is right for you?
            </h2>
            <div className="mt-10">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="rounded-md bg-white px-6 py-3 text-lg font-bold text-[#0B162A] shadow-lg hover:bg-[#C83803] hover:text-white transition-all uppercase"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Mini FAQ Section */}
          <div className="mx-auto max-w-4xl px-6 lg:px-8 mt-16">
            <div className="rounded-2xl bg-[#0B162A] border border-[#C83803]/50 p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Why Offer Neuronics tPBM Through BrainCore?
              </h3>
              <ul className="space-y-4">
                {[
                  { title: "Exclusive Provider Pricing", desc: " – Save 10% on every device with code BrainCore" },
                  { title: "Seamless Fulfillment", desc: " – Direct shipping to your practice or clients" },
                  { title: "Revenue Growth", desc: " – Earn profits on every helmet sold" },
                  { title: "Personalized Care", desc: " – Enhance neurofeedback outcomes with QEEG-driven customization" }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-[#C83803] shrink-0 mt-1" />
                    <div className="ml-3">
                      <span className="font-bold text-white">{item.title}</span>
                      <span className="text-gray-300">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-center text-lg font-bold text-[#C83803]">
                Empower your patients. Expand your practice.
              </p>
              <p className="mt-2 text-center text-base text-gray-300">
                With BrainCore + Neuronics, you can combine the power of light and data to deliver truly personalized brain health solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Product Comparison Table */}
        <div className="bg-[#0B162A] py-16 sm:py-24 border-t border-[#C83803]/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Neuronics tPBM Package Comparison
            </h3>
            
            {/* Mobile Accordion View */}
            <div className="sm:hidden space-y-3">
              {[
                { name: "Neuronics Light Package", img: "/main-images/side view of helmet.jpg", desc: "Affordable at-home tPBM system delivering reliable, full-coverage near‑infrared stimulation.", bestFor: "Built for BrainCore providers who want to extend care beyond the office." },
                { name: "Neuronics Neuroradiant 1070 Package", img: "/main-images/Neuradiant Helmet.png", desc: "Advanced clinical‑grade system featuring targeted 1070 nm near‑infrared for deeper brain stimulation.", bestFor: "Designed for clinical environments that demand the highest precision." },
                { name: "QEEG‑Driven Protocol Subscription Package", img: "/main-images/tpbm protocol setting on ios app.webp", desc: "Annual subscription that generates fully personalized tPBM protocols from unlimited QEEG uploads.", bestFor: "Clinics offering customized, data‑driven light therapy tailored to each client." }
              ].map((pkg, idx) => (
                <Disclosure key={idx}>
                  {({ open }) => (
                    <div className="bg-[#0B162A] rounded-xl border border-[#C83803]/30 overflow-hidden">
                      <DisclosureButton className="flex w-full items-center justify-between px-4 py-4 text-left bg-white/5 hover:bg-white/10">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-md flex-shrink-0 border border-[#C83803]/30">
                            <img src={pkg.img} alt={pkg.name} className="h-full w-full object-cover" />
                          </div>
                          <span className="text-base font-bold text-white">{pkg.name}</span>
                        </div>
                        <ChevronDownIcon className={`h-5 w-5 text-[#C83803] transition-transform ${open ? 'rotate-180' : ''}`} />
                      </DisclosureButton>
                      <DisclosurePanel className="px-4 pb-4 pt-2 space-y-4 border-t border-[#C83803]/30">
                        <div>
                          <h4 className="text-sm font-bold text-[#C83803] mb-1">Description</h4>
                          <p className="text-sm text-gray-300">{pkg.desc}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#C83803] mb-1">Best For</h4>
                          <p className="text-sm text-gray-300">{pkg.bestFor}</p>
                        </div>
                      </DisclosurePanel>
                    </div>
                  )}
                </Disclosure>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto shadow-2xl rounded-xl border border-[#C83803]/50">
              <table className="min-w-full divide-y divide-[#C83803]/30 bg-[#0B162A]">
                <thead className="bg-[#C83803]">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider w-24"></th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Package</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Includes</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C83803]/20 bg-[#0B162A]">
                  {[
                    { 
                      name: "Neuronics Light Package", 
                      img: "/main-images/side view of helmet.jpg", 
                      desc: "Affordable at-home tPBM system delivering reliable, full-coverage near‑infrared stimulation.",
                      includes: ["Unlimited client usability", "Direct drop‑shipping", "Full‑coverage stimulation"],
                      bestFor: "Built for BrainCore providers who want to extend care beyond the office."
                    },
                    { 
                      name: "Neuronics Neuroradiant 1070 Package", 
                      img: "/main-images/Neuradiant Helmet.png", 
                      desc: "Advanced clinical‑grade system featuring targeted 1070 nm near‑infrared for deeper brain stimulation.",
                      includes: ["Research‑grade tPBM", "Targeted 1070 nm stimulation", "4‑Quadrant control"],
                      bestFor: "Designed for clinical environments that demand the highest precision."
                    },
                    { 
                      name: "QEEG‑Driven Protocol Subscription", 
                      img: "/main-images/tpbm protocol setting on ios app.webp", 
                      desc: "Annual subscription that generates fully personalized tPBM protocols from unlimited QEEG uploads.",
                      includes: ["Unlimited QEEG uploads", "Unlimited clients", "All protocol updates"],
                      bestFor: "Clinics offering customized, data‑driven light therapy."
                    }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="h-16 w-16 overflow-hidden rounded-md border border-[#C83803]/30">
                          <img src={row.img} alt={row.name} className="h-full w-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-white">{row.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{row.desc}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <div className="space-y-1">
                          {row.includes.map((inc, i) => (
                            <div key={i} className="flex items-center"><CheckIcon className="h-4 w-4 text-[#C83803] mr-2 shrink-0" /><span>{inc}</span></div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#C83803] border-t-4 border-white">
          <div className="px-6 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl drop-shadow-md">
                Ready to elevate your practice?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90 font-medium">
                Use code <span className="font-black text-[#0B162A] bg-white px-2 py-0.5 rounded">BrainCore</span> to access exclusive provider pricing and start delivering precision, data-driven brain health solutions.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#pricing"
                  className="rounded-md bg-white px-8 py-4 text-lg font-bold text-[#0B162A] shadow-xl hover:bg-[#0B162A] hover:text-white transition-all uppercase tracking-wide transform hover:scale-105"
                >
                  Get Started Today
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        <Dialog open={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="mx-auto max-w-lg w-full bg-[#0B162A] rounded-2xl shadow-2xl border-2 border-[#C83803]">
              <div className="p-8">
                <DialogTitle className="text-2xl font-bold text-white mb-2">
                  Get in Touch
                </DialogTitle>
                <p className="text-gray-300 mb-6">
                  Tell us about your practice and we'll get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#C83803] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="block w-full rounded-md border-[#C83803]/50 bg-[#0B162A] text-white shadow-sm focus:border-[#C83803] focus:ring-[#C83803] px-4 py-2 border"
                      placeholder="Dr. John Smith"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#C83803] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="block w-full rounded-md border-[#C83803]/50 bg-[#0B162A] text-white shadow-sm focus:border-[#C83803] focus:ring-[#C83803] px-4 py-2 border"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Location Field */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-[#C83803] mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="block w-full rounded-md border-[#C83803]/50 bg-[#0B162A] text-white shadow-sm focus:border-[#C83803] focus:ring-[#C83803] px-4 py-2 border"
                      placeholder="City, State"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#C83803] mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="block w-full rounded-md border-[#C83803]/50 bg-[#0B162A] text-white shadow-sm focus:border-[#C83803] focus:ring-[#C83803] px-4 py-2 border resize-none"
                      placeholder="Tell us about your practice and what you're looking for..."
                    />
                  </div>

                  {/* Submit Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="rounded-md bg-green-900/20 border border-green-500 p-4">
                      <p className="text-sm font-medium text-green-400">
                        Message sent successfully! We'll be in touch soon.
                      </p>
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="rounded-md bg-red-900/20 border border-red-500 p-4">
                      <p className="text-sm font-medium text-red-400">
                        Something went wrong. Please try again or email us directly at emil@thankyuu.com
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsContactModalOpen(false)}
                      className="flex-1 rounded-md bg-transparent border border-gray-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded-md bg-[#C83803] px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-white hover:text-[#0B162A] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
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
