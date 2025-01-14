import { getDatabase, getPage } from "../../../lib/notion";

export async function generateStaticParams() {
  const articles = await getDatabase();

  return articles.map((post) => ({
    id: String(post.id),
  }));
}

export default async function BlogPost({ params }: any) {
  const { id } = params;
  const post = await getPage(id);

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="prose dark:prose-invert max-w-none">
        {/* Article Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
            {post.author && (
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">By {post.author}</span>
              </div>
            )}
            {post.date && (
              <>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <time>{post.date}</time>
                </div>
              </>
            )}
          </div>

          {post.category && (
            <div className="mb-4 flex justify-center">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {post.category}
                </span>
              </div>
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div 
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="mt-8 space-y-4 [&_pre]:!p-0 [&_code]:!text-sm [&_pre]:!bg-gray-100 [&_pre]:dark:!bg-gray-800 [&_code]:!leading-normal"
        />
      </div>
    </article>
  );
}
