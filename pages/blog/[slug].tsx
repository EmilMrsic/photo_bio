import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Head from 'next/head';
import { formatDate } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';

interface BlogContent {
  heading: string;
  type: 'h2' | 'h3' | 'p' | 'image';
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
}

// Extended blog content for each post
const blogContent: Record<string, BlogContent[]> = {
  'revolutionizing-photobiomodulation-therapy': [
    {
      heading: 'The Science Behind Photobiomodulation',
      type: 'h2',
    },
    {
      heading: '',
      type: 'p',
      content: 'Photobiomodulation (PBM) therapy, also known as low-level laser therapy (LLLT), is revolutionizing the way we approach healing and wellness. This innovative treatment uses specific wavelengths of light to stimulate cellular processes, promoting healing, reducing inflammation, and enhancing overall cellular function.',
    },
    {
      heading: '',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
      imageAlt: 'Advanced photobiomodulation technology',
    },
    {
      heading: 'Key Benefits and Applications',
      type: 'h2',
    },
    {
      heading: 'Accelerated Wound Healing',
      type: 'h3',
    },
    {
      heading: '',
      type: 'p',
      content: 'Clinical studies have demonstrated that PBM therapy can significantly accelerate wound healing by stimulating collagen production, increasing blood flow, and promoting cellular regeneration. Patients with chronic wounds have seen remarkable improvements in healing times.',
    },
    {
      heading: 'Cognitive Enhancement',
      type: 'h3',
    },
    {
      heading: '',
      type: 'p',
      content: 'Recent research has shown promising results in using near-infrared light to enhance cognitive function. The therapy appears to improve mitochondrial function in brain cells, potentially helping with conditions like Alzheimer\'s disease and traumatic brain injury.',
    },
    {
      heading: '',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      imageAlt: 'Brain imaging showing effects of light therapy',
    },
    {
      heading: 'The Future of Light Therapy',
      type: 'h2',
    },
    {
      heading: '',
      type: 'p',
      content: 'As research continues to unveil the mechanisms behind photobiomodulation, we\'re discovering new applications across various medical fields. From dermatology to neurology, the potential for light-based therapies seems limitless. The non-invasive nature and minimal side effects make PBM an attractive option for patients seeking alternative or complementary treatments.',
    },
  ],
  'red-light-therapy-athletic-performance': [
    {
      heading: 'The Athletic Edge: How Red Light Therapy Works',
      type: 'h2',
    },
    {
      heading: '',
      type: 'p',
      content: 'Professional athletes and sports teams worldwide are incorporating red light therapy into their training and recovery protocols. This cutting-edge technology uses specific wavelengths (typically 660nm and 850nm) to penetrate deep into tissues, triggering biological processes that enhance performance and accelerate recovery.',
    },
    {
      heading: '',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
      imageAlt: 'Athlete using red light therapy device',
    },
    {
      heading: 'Performance Benefits',
      type: 'h2',
    },
    {
      heading: 'Enhanced Muscle Recovery',
      type: 'h3',
    },
    {
      heading: '',
      type: 'p',
      content: 'Red light therapy has been shown to reduce muscle fatigue and soreness by up to 40% when used before and after intense training sessions. The therapy increases ATP production in cells, providing more energy for muscle repair and growth.',
    },
    {
      heading: 'Increased Strength and Endurance',
      type: 'h3',
    },
    {
      heading: '',
      type: 'p',
      content: 'Studies have demonstrated that regular use of red light therapy can lead to significant improvements in muscle strength and endurance. Athletes report being able to train harder and longer with less fatigue.',
    },
    {
      heading: '',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      imageAlt: 'Athletic performance training',
    },
    {
      heading: 'Implementation Strategies',
      type: 'h2',
    },
    {
      heading: '',
      type: 'p',
      content: 'For optimal results, athletes should use red light therapy 10-20 minutes before training to prime muscles and again post-workout to accelerate recovery. Consistency is key – daily use during training periods can lead to cumulative benefits that translate into better performance on game day.',
    },
  ],
  'infrared-therapy-chronic-pain-management': [
    {
      heading: 'Understanding Chronic Pain and Infrared Therapy',
      type: 'h2',
    },
    {
      heading: '',
      type: 'p',
      content: 'Chronic pain affects millions of people worldwide, often resistant to traditional treatments. Infrared therapy offers a promising alternative by using deep-penetrating light wavelengths to address pain at its source. Unlike medications that merely mask symptoms, infrared therapy promotes actual healing at the cellular level.',
    },
    {
      heading: '',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      imageAlt: 'Infrared therapy treatment session',
    },
    {
      heading: 'Clinical Evidence and Research',
      type: 'h2',
    },
    {
      heading: 'Arthritis and Joint Pain',
      type: 'h3',
    },
    {
      heading: '',
      type: 'p',
      content: 'Multiple clinical trials have shown that infrared therapy can significantly reduce pain and stiffness in arthritis patients. The therapy increases blood circulation, reduces inflammation, and promotes the repair of damaged tissues. Patients often report improved mobility and reduced reliance on pain medications.',
    },
    {
      heading: 'Neuropathic Pain',
      type: 'h3',
    },
    {
      heading: '',
      type: 'p',
      content: 'For patients suffering from neuropathic pain, infrared therapy has shown remarkable results. The light wavelengths help repair damaged nerve cells and reduce the hypersensitivity that characterizes this type of pain. Many patients experience significant relief after just a few sessions.',
    },
    {
      heading: '',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      imageAlt: 'Patient receiving infrared therapy',
    },
    {
      heading: 'Treatment Protocols and Patient Outcomes',
      type: 'h2',
    },
    {
      heading: '',
      type: 'p',
      content: 'Successful infrared therapy typically involves regular sessions over several weeks. Most patients begin to experience relief within the first few treatments, with continued improvement over time. The non-invasive nature of the therapy means it can be safely combined with other treatments, offering a comprehensive approach to pain management without the risks associated with long-term medication use.',
    },
  ],
};

// Static blog posts for demo content
const staticBlogPosts = [
  {
    id: 1,
    slug: 'revolutionizing-photobiomodulation-therapy',
    title: 'Revolutionizing Photobiomodulation: The Future of Light Therapy',
    author: 'Dr. Sarah Mitchell',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    date: '2024-03-15',
    excerpt: 'Discover how cutting-edge photobiomodulation technology is transforming healthcare.',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    readTime: '5 min read',
    category: 'Technology',
  },
  {
    id: 2,
    slug: 'red-light-therapy-athletic-performance',
    title: 'Red Light Therapy for Athletic Performance: A Game Changer',
    author: 'Dr. James Chen',
    authorImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150',
    date: '2024-03-10',
    excerpt: 'Elite athletes are turning to red light therapy for recovery and performance enhancement.',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    readTime: '7 min read',
    category: 'Sports Medicine',
  },
  {
    id: 3,
    slug: 'infrared-therapy-chronic-pain-management',
    title: 'Breaking Through: Infrared Therapy in Chronic Pain Management',
    author: 'Dr. Emily Rodriguez',
    authorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    date: '2024-03-05',
    excerpt: 'New clinical studies reveal promising results for infrared therapy.',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    readTime: '6 min read',
    category: 'Pain Management',
  },
];

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDynamicPost, setIsDynamicPost] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      // First check if it's a static post
      const staticPost = staticBlogPosts.find(p => p.slug === slug);
      if (staticPost) {
        setPost(staticPost);
        setIsDynamicPost(false);
        setLoading(false);
        return;
      }

      // Otherwise, fetch from database
      const response = await fetch(`/api/blog/${slug}`);
      if (response.ok) {
        const dynamicPost = await response.json();
        setPost({
          ...dynamicPost,
          author: 'AI Generated',
          authorImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150',
          readTime: `${Math.ceil(dynamicPost.content.split(' ').length / 200)} min read`,
          category: dynamicPost.keywords?.[0] || 'Photobiomodulation',
          coverImage: dynamicPost.image_url || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
          date: dynamicPost.published_at || dynamicPost.created_at,
          excerpt: dynamicPost.content.substring(0, 150) + '...'
        });
        setIsDynamicPost(true);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }
  
  if (!post) {
    return (
      <Layout title="Post Not Found">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
          <Link href="/blog" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
            ← Back to blog
          </Link>
        </div>
      </Layout>
    );
  }
  
  const content = !isDynamicPost && slug ? blogContent[slug as string] : [];
  
  return (
    <>
      <Head>
        <title>{post.title} | PhotoBio Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.coverImage} />
        <meta name="author" content={post.author} />
        <meta property="article:published_time" content={post.date} />
      </Head>
      
      <Layout title={post.title}>
        <article className="bg-white">
          {/* Hero Section */}
          <div className="relative h-96 lg:h-[500px]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </div>
          
          {/* Article Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
            <div className="bg-white rounded-lg shadow-xl p-8 lg:p-12">
              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                  <Link href="/blog" className="hover:text-gray-700">
                    Blog
                  </Link>
                  <span>›</span>
                  <span className="text-indigo-600">{post.category}</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {post.title}
                </h1>
                
                <div className="flex items-center space-x-4">
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{post.author}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </header>
              
              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                {isDynamicPost ? (
                  // Render markdown content for dynamic posts
                  <ReactMarkdown
                    components={{
                      h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3" {...props} />,
                      p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-6" {...props} />,
                      img: ({node, ...props}) => <img className="w-full rounded-lg shadow-lg my-8" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6" {...props} />,
                      li: ({node, ...props}) => <li className="mb-2" {...props} />,
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                ) : (
                  // Render structured content for static posts
                  content?.map((section, index) => {
                    switch (section.type) {
                      case 'h2':
                        return (
                          <h2 key={index} className="text-3xl font-bold text-gray-900 mt-12 mb-4">
                            {section.heading}
                          </h2>
                        );
                      case 'h3':
                        return (
                          <h3 key={index} className="text-xl font-semibold text-gray-800 mt-8 mb-3">
                            {section.heading}
                          </h3>
                        );
                      case 'p':
                        return (
                          <p key={index} className="text-gray-700 leading-relaxed mb-6">
                            {section.content}
                          </p>
                        );
                      case 'image':
                        return (
                          <figure key={index} className="my-8">
                            <img
                              src={section.imageUrl}
                              alt={section.imageAlt}
                              className="w-full rounded-lg shadow-lg"
                            />
                            {section.imageAlt && (
                              <figcaption className="text-center text-sm text-gray-500 mt-2">
                                {section.imageAlt}
                              </figcaption>
                            )}
                          </figure>
                        );
                      default:
                        return null;
                    }
                  })
                )}
              </div>
              
              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Share this article</p>
                  <div className="flex space-x-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Articles */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staticBlogPosts
                .filter(p => p.id !== post.id)
                .slice(0, 3)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <img
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                          {formatDate(relatedPost.date)} · {relatedPost.readTime}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
            </div>
          </div>
        </article>
      </Layout>
    </>
  );
}
