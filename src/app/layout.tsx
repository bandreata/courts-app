import { Sora } from "next/font/google";
import "./globals.css";
import Alert from "@/components/Alert";
import BackToTop from "@/components/BackToTop";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // escolha os pesos que for usar
});

export const metadata = {
  title: "Diários de Justiça",
  description: "Lista de diários e intimações eletrônicas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${sora.className} bg-gray-50 text-gray-900`}>
        {/* Header */}
        <header className="bg-[#000212] text-white shadow sticky top-0 z-50">
          <div className="mx-auto flex items-center justify-between p-3 sm:p-4">
            <img
              src="https://cdn.projurisadv.com.br/interfaces/images/logo-projurisadv-branco.svg"
              alt="Projuris ADV"
              className="h-7 w-auto"
            />
            <span className="text-sm ms-2 ps-2 border-l border-l-[#ccc] opacity-80 text-white">
              Diários de Justiça e Intimação Eletrônica
            </span>
          </div>
        </header>

        {/* 🔔 ALERTAS LOGO ABAIXO DO HEADER */}
        <div className="mx-auto w-full px-3 sm:px-4 mt-4 space-y-3">
          <Alert type="warning">
            A Publicação de Intimações em Diários de Justiça e/ou Portais
            Eletrônicos são de responsabilidade do respectivo Tribunal, estando
            o Projuris ADV unicamente responsável pela captura das intimações
            efetivamente publicadas.
          </Alert>

          <Alert type="warning">
            Diários administrativos e de outros poderes, como tribunal de contas,
            municipais e legislativos não são habilitados por padrão. Devem ser
            solicitados ao suporte.
          </Alert>

          <Alert type="warning">
            Sistemas e Portais de intimação eletrônica que exigem usuário e senha
            do advogado, são ativados diretamente no sistema:{" "}
            <a
              className="underline"
              href="https://ajuda.projurisadv.com.br/space/BDC/20447270/Como+cadastrar+uma+captura+de+intima%C3%A7%C3%A3o+eletr%C3%B4nica+no+Projuris+ADV"
              target="_blank"
              rel="noreferrer"
            >
              Passo a passo
            </a>.
          </Alert>
        </div>

        {/* Conteúdo principal */}
        <main className="mx-auto py-6">{children}</main>

        {/* Footer */}
        <footer className="bg-[#202630] text-white text-sm py-4 mt-10">
          <div className="mx-auto px-3 sm:px-4 text-center">
            © {new Date().getFullYear()} — Projuris ADV
          </div>
        </footer>

        <BackToTop showAfter={300} />
      </body>
    </html>
  );
}
