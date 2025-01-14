/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // 动态主题：添加 resolve.alias 配置，将动态路径映射到实际路径
    // config.resolve.alias["@"] = path.resolve(__dirname);
    // Enable source maps in development mode
    if (process.env.NODE_ENV_API === "development") {
      config.devtool = "source-map";
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 匹配所有主机名
      },
    ],
  },
};

export default nextConfig;
