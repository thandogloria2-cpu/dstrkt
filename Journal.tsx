
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from './supabase';
import { Loader2, Music, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Article {
  id: string | number;
  title: string;
  category: string;
  published_date: string;
  image_url: string;
  has_sound?: boolean;
}

const Journal: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('journal_stories & sounds')
          .select('*')
          .order('published_date', { ascending: false });

        if (error) {
          console.error('Journal fetch error:', error);
          setArticles([]);
        } else {
          // Ensure we have the data from Supabase
          setArticles(data || []);
        }
      } catch (err) {
        console.error('Journal fetch failed:', err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className="bg-black pt-24 md:pt-40 pb-20 md:pb-32 min-h-screen">
      <header className="px-6 md:px-12 max-w-[1800px] mx-auto mb-12 md:mb-24">
        <Link to="/" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <p className="text-[#D4AF37] text-[10px] tracking-[0.8em] font-black uppercase mb-6 md:mb-8">The Journal</p>
        <h1 className="text-5xl sm:text-7xl md:text-[10vw] font-black tracking-[-0.05em] uppercase leading-none break-words">Stories<br />& Sounds.</h1>
      </header>

      <section className="px-6 md:px-12 max-w-[1800px] mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 md:py-40">
            <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {articles.map((article) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] bg-[#0d0d0d] overflow-hidden mb-8 border border-white/5 transition-all group-hover:border-[#D4AF37] relative">
                  <img 
                    src={article.image_url} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                  />
                  {article.has_sound && (
                    <div className="absolute top-6 right-6 bg-[#D4AF37] text-black p-2 rounded-full">
                      <Music size={14} />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] tracking-[0.4em] font-bold text-[#D4AF37] uppercase mb-4">{article.category}</p>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic">{article.title}</h3>
                  </div>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    {new Date(article.published_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).toUpperCase()}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Journal;
