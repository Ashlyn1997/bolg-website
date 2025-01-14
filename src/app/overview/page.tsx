import Link from "next/link";
import { getDatabase } from "../../lib/notion";

export default async function OverviewPage() {
  const articles = await getDatabase();
  
  // Sort articles by date from oldest to newest
  const sortedArticles = articles.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Timeline</h1>
      
      {/* Desktop Timeline */}
      <div className="relative hidden md:block">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        
        <div className="space-y-12">
          {sortedArticles.map((article, index) => (
            <div key={article.id} className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
              {/* Content */}
              <div className="w-5/12">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <time className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  
                  <Link 
                    href={`/blog/${article.id}`}
                    className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {article.title}
                  </Link>
                  
                  {article.category && (
                    <div className="mt-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {article.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Timeline dot */}
              <div className="w-2/12 flex justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900"></div>
              </div>
              
              {/* Empty space for alignment */}
              <div className="w-5/12"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden space-y-8">
        {sortedArticles.map((article) => (
          <div key={article.id} className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
            {/* Timeline dot */}
            <div className="absolute left-0 top-0 -translate-x-1/2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900"></div>
            </div>
            
            {/* Content */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <time className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              <Link 
                href={`/blog/${article.id}`}
                className="text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
              >
                {article.title}
              </Link>
              
              {article.category && (
                <div className="mt-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    {article.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
