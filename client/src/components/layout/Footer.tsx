import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-[#23222A] text-white">
            <div className="w-11/12 max-w-7xl mx-auto py-10 space-y-8">

                <div className="flex flex-col md:flex-row justify-between gap-8">

                    <div className="space-y-3 max-w-sm">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo-sem-fundo.png"
                                alt="Simbora beber logo"
                                width={140}
                                height={100}
                            />

                        </div>

                        <p className="text-sm text-zinc-400">
                            Gerencie comandas, produtos e seu bar de forma simples,
                            rápida e moderna.
                        </p>
                    </div>

                    <div className="flex gap-12 text-sm">

                        <div className="space-y-2">
                            <p className="font-semibold text-white">Sistema</p>
                            <div className="flex flex-col gap-1 text-zinc-400">
                                <Link href="/" className="hover:text-white transition">
                                    Início
                                </Link>
                                <Link href="/" className="hover:text-white transition">
                                    Acessar
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="font-semibold text-white">Suporte</p>
                            <div className="flex flex-col gap-1 text-zinc-400">
                                <Link href="#" className="hover:text-white transition">
                                    Ajuda
                                </Link>
                                <Link href="#" className="hover:text-white transition">
                                    Contato
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="w-full h-px bg-zinc-700" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-zinc-400">

                    <p>
                        © {new Date().getFullYear()} Simbora beber. Todos os direitos reservados.
                    </p>

                    <div className="w-auto  flex items-center justify-center gap-2">
                        <Link
                            href="https://devluanpaiva.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs"
                        >
                            <Image
                                src="/logo-dev-luan-paiva.png"
                                alt="JUSRN Logo"
                                width={60}
                                height={60}
                                className="object-contain"
                            />
                            <p className="text-white">
                                Desenvolvido <br /> por{" "}
                                <strong>
                                    <span className="text-[#F28B0C]">dev</span>LuanPaiva
                                </strong>
                            </p>
                        </Link>
                    </div>

                </div>

            </div>
        </footer>
    );
}