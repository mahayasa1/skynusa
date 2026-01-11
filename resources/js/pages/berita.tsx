import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Calendar, User, Eye, Clock, Tag } from 'lucide-react';

interface Berita {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  category: string;
  tags: string[];
  published_at: string;
  views: number;
  user: {
    name: string;
  };
}

interface BeritaPageProps {
  beritas: {
    data: Berita[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  featured?: Berita[];
  categories: Record<string, string>;
  currentCategory?: string;
}

export default function BeritaPage({ beritas, featured = [], categories, currentCategory }: BeritaPageProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <PublicLayout>
      <Head title="Berita & Artikel" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Berita & Artikel
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Informasi terkini seputar teknologi, tips, dan perkembangan industri
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link
              href="/berita"
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                !currentCategory
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              Semua
            </Link>
            {Object.entries(categories).map(([key, label]) => (
              <Link
                key={key}
                href={`/berita/category/${key}`}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  currentCategory === key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Featured Articles */}
          {featured.length > 0 && !currentCategory && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikel Pilihan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map((article) => (
                  <Link
                    key={article.id}
                    href={`/berita/${article.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.featured_image ? `/storage/${article.featured_image}` : '/asset/placeholder.jpg'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(article.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {article.views}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beritas.data.map((article) => (
              <Link
                key={article.id}
                href={`/berita/${article.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={article.featured_image ? `/storage/${article.featured_image}` : '/asset/placeholder.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {article.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full">
                        {categories[article.category] || article.category}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {article.user.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(article.published_at)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="w-3.5 h-3.5" />
                      {article.views} views
                    </span>
                    
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {article.tags.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {beritas.last_page > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {beritas.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    link.active
                      ? 'bg-blue-600 text-white'
                      : link.url
                      ? 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {beritas.data.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Belum Ada Berita
              </h3>
              <p className="text-gray-600">
                Berita untuk kategori ini akan segera hadir
              </p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}