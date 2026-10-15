import React, { useState } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/blogsData';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Search, 
  User, 
  ArrowRight, 
  X, 
  Share2, 
  Tag, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [subscribedEmail, setSubscribedEmail] = useState<string>('');
  const [subscribedSuccess, setSubscribedSuccess] = useState<boolean>(false);

  const categories = ['All', 'Visas & Immigration', 'Scholarships', 'Career Pathways', 'Test Prep'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribedEmail) return;
    setSubscribedSuccess(true);
    setTimeout(() => {
      setSubscribedSuccess(false);
      setSubscribedEmail('');
    }, 4000);
  };

  return (
    <section id="blogs-section" aria-labelledby="blogs-heading" className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Admissions & Policy Knowledge Hub
          </div>
          <h2 id="blogs-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Guides, Visa Updates & Scholarship Strategies
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Researched articles written by former admissions officers and global visa attorneys. Stay ahead of 2026 intake policy shifts.
          </p>

          {/* Search Bar & Categories */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search visas, scholarships, tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1 group"
            >
              {/* Image banner */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={`${post.title} - Upbeat Abroad Education Guide`}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={350}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-blue-700 shadow-2xs">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Author Info */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={`${post.author.name}, ${post.author.role}`}
                      loading="lazy"
                      decoding="async"
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {post.author.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block line-clamp-1">
                        {post.author.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Full Article Reader Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Cover Image */}
              <div className="relative h-64 w-full">
                <img
                  src={selectedPost.coverImage}
                  alt={`${selectedPost.title} - Guide Overview`}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider bg-blue-600 px-2.5 py-1 rounded-md text-white mb-2 inline-block">
                    {selectedPost.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold leading-snug font-display">
                    {selectedPost.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-300">
                    <span>By {selectedPost.author.name}</span>
                    <span>•</span>
                    <span>{selectedPost.date}</span>
                    <span>•</span>
                    <span>{selectedPost.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-10 space-y-6">
                {/* Introduction */}
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedPost.content.introduction}
                </p>

                {/* Key Takeaways Box */}
                <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-200/80">
                  <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Key Strategic Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {selectedPost.content.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-blue-950">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deep-dive sections */}
                <div className="space-y-6">
                  {selectedPost.content.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-2">
                      <h4 className="text-base font-bold text-slate-900 font-display">
                        {sec.heading}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {sec.body}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Conclusion */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    The Upbeat Perspective
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedPost.content.conclusion}
                  </p>
                </div>

                {/* Author Card */}
                <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                  <img
                    src={selectedPost.author.avatar}
                    alt={`${selectedPost.author.name}, ${selectedPost.author.role}`}
                    loading="lazy"
                    decoding="async"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{selectedPost.author.name}</h5>
                    <p className="text-[11px] text-slate-500">{selectedPost.author.role}</p>
                    <p className="text-[10px] text-blue-600 mt-0.5">Upbeat Editorial & Advisory Board</p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {selectedPost.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Close Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Signup Banner */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-md text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Weekly Advisory Digest
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">
            Never Miss a Deadline or Scholarship Alert
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Join 34,000+ prospective international students receiving verified visa policy changes, test preparation tips, and university deadline reminders.
          </p>

          <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={subscribedEmail}
              onChange={(e) => setSubscribedEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Subscribe Free
            </button>
          </form>

          {subscribedSuccess && (
            <p className="mt-3 text-xs font-bold text-emerald-600 animate-in fade-in">
              ✓ Thank you! You’re subscribed to the Upbeat Abroad Education Digest.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
