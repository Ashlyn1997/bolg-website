import Image from "next/image";
import { getDatabase } from "../lib/notion";
import Link from "next/link";

export default async function Home() {
  const articles = await getDatabase();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="container mx-auto px-4 py-8">
        {/* Author Profile Section */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <Image
              src="https://avatars.githubusercontent.com/u/48005052?s=400&u=53f6ee661eb5d6f6dfb9cda9418c22965db94477&v=4"
              alt="Ashlyn Tu"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <Link 
                href="/about"
                className="text-2xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Ashlyn Tu
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Digital Creator & Full-stack Developer</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Passionate about web development and creating digital experiences.
              </p>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center md:text-left">
          Latest Articles
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              href={`/blog/${article.id}`}
              key={article.id}
              className="group block h-full"
            >
              <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                <div className="relative h-52 w-full flex-shrink-0">
                  <Image
                    src={article.cover || "/default-cover.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  {article.category && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                      {article.category}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <time>
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>

                  <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                    {article.title}
                  </h2>

                  {article.AISummary && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
                      {article.AISummary}
                    </p>
                  )}

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium mt-auto">
                    Read more
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
