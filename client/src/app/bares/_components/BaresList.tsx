"use client"
import { IBar } from "@/data/models/IBar";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Beer } from "lucide-react";


interface BarsListProps {
    bars: IBar[];
}
export function BarsList({ bars }: Readonly<BarsListProps>) {
    return (
        <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {bars.map((bar, index) => (
                <motion.div
                    key={bar.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Link href={`/bares/${bar.slug}`}>
                        <div
                            className={cn(
                                "group overflow-hidden rounded-2xl",
                                "bg-white shadow-sm hover:shadow-xl",
                                "transition-all duration-300",
                                "cursor-pointer border border-[#BFAE99]/30"
                            )}
                        >
                            <div className="relative h-40 w-full bg-[#F2BE5C]/30">
                                {bar.image ? (
                                    <Image
                                        src={bar.image}
                                        alt={bar.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition duration-500"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Beer size={40} className="text-[#F28B0C]" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h2 className="font-semibold text-lg text-zinc-800 group-hover:text-[#F28B0C] transition">
                                    {bar.name}
                                </h2>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </section>
    )
}