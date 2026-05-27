/** @type {import('next').NextConfig} */

// 如果部署到 username.github.io/repo-name，需要设置 basePath
// 如果部署到 username.github.io（用户主页仓库），basePath 留空
const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.GITHUB_REPO || ''; // 如果是 xxx.github.io，留空；否则填仓库名

const nextConfig = {
  output: 'export',           // 静态导出，可部署到 GitHub Pages
  images: {
    unoptimized: true,        // GitHub Pages 不支持 Next.js 的图片优化
  },
  basePath: isProd && repoName ? `/${repoName}` : '',
  assetPrefix: isProd && repoName ? `/${repoName}/` : '',
  trailingSlash: true,        // GitHub Pages 对路径较敏感
  reactStrictMode: true,
};

module.exports = nextConfig;
