/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    // Skip ESLint errors during build (useful for Vercel deploys)
    ignoreDuringBuilds: true,
  },
  // Configuração para exportação estática
  output: 'export',
  // Desativar análise de imagens durante a exportação estática
  images: {
    unoptimized: true,
  },
  // Remover a necessidade de trailing slash
  trailingSlash: false,
  // Definir o path base se o site não estiver na raiz do domínio
  // Descomente e ajuste se necessário
  // basePath: '/subdiretorio',
};

module.exports = nextConfig;
