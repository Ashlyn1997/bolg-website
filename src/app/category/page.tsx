import { getDatabase } from "../../lib/notion";

export default async function CategoryPage() {
  const articles = await getDatabase();

  // Group articles by category
  const categorizedArticles = articles.reduce((acc: { [key: string]: any[] }, article) => {
    const category = article.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(article);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Categories</h1>

      <div className="space-y-12">
        {Object.entries(categorizedArticles).map(([category, articles]) => (
          <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              {category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <div 
                  key={article.id} 
                  className="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800"
                >
                  <time className="text-sm text-gray-500 dark:text-gray-400 mb-3 block font-medium">
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  
                  <a 
                    href={`/blog/${article.id}`}
                    className="text-lg font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 block mb-4 group-hover:text-blue-500"
                  >
                    {article.title}
                  </a>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag: string) => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 cursor-pointer transform hover:scale-105"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
