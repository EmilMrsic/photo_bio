import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { formatDate } from '../../lib/utils';
import { SparklesIcon } from '@heroicons/react/24/outline';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  author?: string;
  authorImage?: string;
  date: string;
  excerpt: string;
  coverImage: string;
  readTime?: string;
  category?: string;
  content?: string;
  keywords?: string[];
  image_url?: string;
  published_at?: string;
  created_at?: number;
}

// Sample blog posts for static content
const staticBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'revolutionizing-photobiomodulation-therapy',
    title: 'Revolutionizing Photobiomodulation: The Future of Light Therapy',
    author: 'Dr. Sarah Mitchell',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    date: '2024-03-15',
    excerpt: 'Discover how cutting-edge photobiomodulation technology is transforming healthcare, from accelerating wound healing to enhancing cognitive function. Learn about the latest research and clinical applications.',
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
    excerpt: 'Elite athletes are turning to red light therapy for recovery and performance enhancement. Explore the science behind how specific wavelengths can reduce inflammation, boost mitochondrial function, and accelerate muscle recovery.',
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
    excerpt: 'New clinical studies reveal promising results for infrared therapy in treating chronic pain conditions. From arthritis to neuropathy, learn how this non-invasive treatment is changing lives without the side effects of traditional medications.',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    readTime: '6 min read',
    category: 'Pain Management',
  },
];

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(staticBlogPosts);
  const [loading, setLoading] = useState(true);
  const [dynamicBlogsLoaded, setDynamicBlogsLoaded] = useState(false);

  useEffect(() => {
    // Show static blogs immediately
    setLoading(false);
    // Then fetch dynamic blogs in the background
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const aiBlogs = await response.json();
        // Only process if we have blogs
        if (Array.isArray(aiBlogs) && aiBlogs.length > 0) {
          // Transform AI blogs to match our BlogPost interface
          const transformedBlogs = aiBlogs.map((blog: any) => ({
            id: blog.id,
            slug: blog.slug,
            title: blog.title,
            date: blog.published_at || new Date(blog.created_at).toISOString(),
            excerpt: getExcerpt(blog.content),
            coverImage: blog.image_url || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
            content: blog.content,
            keywords: blog.keywords,
            author: 'AI Generated',
            authorImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150', // AI avatar
            readTime: `${Math.ceil((blog.content?.split(' ').length || 0) / 200)} min read`,
            category: blog.keywords?.[0] || 'Photobiomodulation'
          }));
          
          // Combine static and AI-generated blogs
          setBlogPosts([...transformedBlogs, ...staticBlogPosts]);
          setDynamicBlogsLoaded(true);
        }
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const getExcerpt = (content: string, length = 150) => {
    if (!content) return '';
    // Remove markdown formatting
    const plainText = content
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/\n{2,}/g, ' ') // Replace multiple newlines with space
      .trim();
    
    return plainText.length > length 
      ? plainText.substring(0, length) + '...' 
      : plainText;
  };
  return (
    <Layout title="Blog">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-indigo-50 to-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Insights & Research</span>
                <span className="block text-indigo-600 mt-2">in Photobiomodulation</span>
              </h1>
              <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                Stay informed with the latest breakthroughs, clinical studies, and expert insights in light therapy and photobiomodulation.
              </p>
              <div className="mt-8">
                <Link
                  href="/blog-ai"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Create Article with AI
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mt-12 grid gap-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            {blogPosts.map((post) => (
              <article key={post.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 group-hover:opacity-90 transition-opacity duration-300">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                    <Link href={`/blog/${post.slug}`} className="group-hover:text-indigo-600 transition-colors duration-200">
                      <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="mt-3 text-base text-gray-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Author and Date */}
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={post.authorImage}
                        alt={post.author}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {post.author}
                      </p>
                      <div className="flex space-x-2 text-sm text-gray-500">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Link
              href="/blog/archive"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
