import React, { useState } from 'react';
import Layout from '../components/Layout';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface BlogData {
  keywords: string[];
  headlines: string[];
  selected_headline?: string;
  blog?: {
    image_description: string;
    content: string;
  };
}

export default function BlogAI() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'headlines' | 'preview'>('input');
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [selectedHeadline, setSelectedHeadline] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatingImage, setGeneratingImage] = useState(false);

  const handleGenerateBlog = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputText }),
      });

      if (!response.ok) throw new Error('Failed to generate blog');

      const data = await response.json();
      setBlogData(data);
      setStep('headlines');
    } catch (error) {
      console.error('Error generating blog:', error);
      alert('Failed to generate blog content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHeadline = async (headline: string) => {
    setSelectedHeadline(headline);
    setLoading(true);

    try {
      const response = await fetch('/api/generate-blog-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input: inputText,
          headline,
          keywords: blogData?.keywords || []
        }),
      });

      if (!response.ok) throw new Error('Failed to generate blog content');

      const data = await response.json();
      setBlogData({
        ...blogData!,
        selected_headline: headline,
        blog: data.blog
      });
      setEditableContent(data.blog.content);
      setImagePrompt(data.blog.image_description);
      setStep('preview');
    } catch (error) {
      console.error('Error generating blog content:', error);
      alert('Failed to generate blog content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    try {
      const response = await fetch('/api/generate-blog-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (!response.ok) throw new Error('Failed to generate image');

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        try {
          // Upload to server
          const response = await fetch('/api/upload-blog-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageData: base64,
              filename: file.name
            }),
          });

          if (!response.ok) throw new Error('Failed to upload image');

          const data = await response.json();
          setImageUrl(data.imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishBlog = async () => {
    if (!selectedHeadline || !editableContent) return;

    try {
      const response = await fetch('/api/save-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedHeadline,
          content: editableContent,
          keywords: blogData?.keywords || [],
          imageUrl: imageUrl || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save blog');
      }

      const data = await response.json();
      
      // Show success message
      alert('Blog published successfully!');
      
      // Redirect to blog listing page
      window.location.href = '/blog';
      
    } catch (error) {
      console.error('Error publishing blog:', error);
      alert('Failed to publish blog. Please try again.');
    }
  };

  return (
    <Layout title="Blog AI Generator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SparklesIcon className="h-8 w-8 text-indigo-600 mr-3" />
            AI Blog Generator
          </h1>
          <p className="mt-2 text-gray-600">
            Transform your ideas into SEO-optimized photobiomodulation content
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              <li className={`relative ${step === 'input' ? 'text-indigo-600' : 'text-gray-900'}`}>
                <div className="flex items-center">
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step === 'input' ? 'bg-indigo-600 text-white' : 'bg-gray-300'
                  }`}>
                    1
                  </span>
                  <span className="ml-2 text-sm font-medium">Input Topic</span>
                </div>
              </li>
              <li className={`relative ml-8 ${step === 'headlines' ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className="flex items-center">
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step === 'headlines' ? 'bg-indigo-600 text-white' : 
                    step === 'preview' ? 'bg-gray-300' : 'bg-gray-200'
                  }`}>
                    2
                  </span>
                  <span className="ml-2 text-sm font-medium">Select Headline</span>
                </div>
              </li>
              <li className={`relative ml-8 ${step === 'preview' ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className="flex items-center">
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step === 'preview' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                  }`}>
                    3
                  </span>
                  <span className="ml-2 text-sm font-medium">Preview & Edit</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Step 1: Input */}
        {step === 'input' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">What would you like to write about?</h2>
            <p className="text-gray-600 mb-6">
              Enter a topic, condition, or question related to photobiomodulation therapy
            </p>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Example: Help my patients with memory loss, Improve focus with non-invasive tools, How PBM helps with anxiety..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
            />
            
            <div className="mt-6">
              <button
                onClick={handleGenerateBlog}
                disabled={loading || !inputText.trim()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Generate Blog Ideas
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Headline */}
        {step === 'headlines' && blogData && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Choose Your Headline</h2>
            
            {/* Keywords */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Target Keywords:</h3>
              <div className="flex flex-wrap gap-2">
                {blogData.keywords.map((keyword, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Headlines */}
            <div className="space-y-3">
              {blogData.headlines.map((headline, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectHeadline(headline)}
                  disabled={loading}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <h3 className="font-medium text-gray-900">{headline}</h3>
                </button>
              ))}
            </div>

            {loading && (
              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center">
                  <svg className="animate-spin h-5 w-5 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Generating your blog...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Preview & Edit */}
        {step === 'preview' && blogData?.blog && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Editor */}
            <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{selectedHeadline}</h2>
              
              {/* Image Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                {imageUrl ? (
                  <div className="relative">
                    <img src={imageUrl} alt="Blog featured" className="w-full h-64 object-cover rounded-lg" />
                    <button
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Upload Image
                      </label>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">or</div>
                    <div className="space-y-3">
                      <textarea
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder="Describe the image you want to generate..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows={2}
                      />
                      <button
                        onClick={handleGenerateImage}
                        disabled={generatingImage || !imagePrompt}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {generatingImage ? 'Generating...' : 'Generate with AI'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Content
                </label>
                <textarea
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={20}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Keywords */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">SEO Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {blogData.keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handlePublishBlog}
                    disabled={!editableContent || !selectedHeadline}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    Publish Blog
                  </button>
                  <button
                    onClick={() => {
                      setStep('headlines');
                      setSelectedHeadline('');
                      setEditableContent('');
                      setImageUrl('');
                    }}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Choose Different Headline
                  </button>
                  <button
                    onClick={() => {
                      setStep('input');
                      setInputText('');
                      setBlogData(null);
                      setSelectedHeadline('');
                      setEditableContent('');
                      setImageUrl('');
                    }}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Start Over
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Pro Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Keep paragraphs short and scannable</li>
                  <li>• Include your primary keyword in the first paragraph</li>
                  <li>• Use headers to break up content</li>
                  <li>• End with a clear call-to-action</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
