import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Calendar, User, Eye, Clock, Tag, Share2, ArrowLeft, TrendingUp } from 'lucide-react';

interface Berita {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  gallery: string[];
  category: string;
  tags: string[];
  published_at: string;
  views: number;
  user: {
    name: string;
  };
}

interface BeritaShowProps {
  berita: Berita;
  related: Berita[];
  popular: Berita[];
}

export default function BeritaShow({ berita, related, popular }: BeritaShowProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: berita.title,
        text: berita.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  return (
    <PublicLayout>
      <Head title={berita.title} />

      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Berita
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Article Header */}
              <div className="mb-8">
                {berita.category && (
                  <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full mb-4">
                    {berita.category}
                  </span>
                )}
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {berita.title}
                </h1>

                {berita.excerpt && (
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {berita.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between py-4 border-y border-gray-200">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {berita.user.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(berita.published_at)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {berita.views} views
                    </span>
                  </div>

                  <button
                    onClick={shareArticle}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Featured Image */}
              {berita.featured_image && (
                <div className="mb-8 rounded-2xl overflow-hidden">
                  <img
                    src={`/storage/${berita.featured_image}`}
                    alt={berita.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: berita.content }}
              />

              {/* Gallery */}
              {berita.gallery && berita.gallery.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Galeri</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {berita.gallery.map((image, index) => (
                      <div key={index} className="rounded-xl overflow-hidden">
                        <img
                          src={`/storage/${image}`}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {berita.tags && berita.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-8 border-t border-gray-200">
                  <Tag className="w-5 h-5 text-gray-400" />
                  {berita.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Related Articles */}
              {related.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Artikel Terkait</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {related.map((article) => (
                      <Link
                        key={article.id}
                        href={`/berita/${article.slug}`}
                        className="group"
                      >
                        <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                          <img
                            src={article.featured_image ? `/storage/${article.featured_image}` : '/asset/placeholder.jpg'}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(article.published_at)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                
                {/* Popular Articles */}
                {popular.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">Artikel Populer</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {popular.map((article) => (
                        <Link
                          key={article.id}
                          href={`/berita/${article.slug}`}
                          className="block group"
                        >
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                              <img
                                src={article.featured_image ? `/storage/${article.featured_image}` : '/asset/placeholder.jpg'}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                                {article.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Eye className="w-3 h-3" />
                                {article.views}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Banner */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">
                    Butuh Konsultasi?
                  </h3>
                  <p className="text-blue-100 mb-6">
                    Tim kami siap membantu kebutuhan teknologi Anda
                  </p>
                  <Link
                    href="/kontak"
                    className="block w-full px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg text-center hover:bg-blue-50 transition-colors"
                  >
                    Hubungi Kami
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}