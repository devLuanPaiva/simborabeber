"use client";

import { IProduct, ProductCategoryLabels } from "@/data/models";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Beer } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/data/functions";

interface ProductProps {
    product: IProduct;
}

export default function ProductDetail({ product }: Readonly<ProductProps>) {
    const router = useRouter();

    return (
        <div className="max-w-3xl mx-auto pb-20">

            <div className="relative h-72 w-full bg-black">

                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-[#F2BE5C]">
                        <Beer size={60} className="text-white" />
                    </div>
                )}

                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-105 transition"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-t-3xl -mt-10 relative p-6 shadow-md"
            >
                <span className="inline-block text-sm font-medium text-white bg-[#F28B0C] px-3 py-1 rounded-full mb-3">
                    {ProductCategoryLabels[product.category]}
                </span>

                <h1 className="text-3xl font-bold text-gray-800">
                    {product.name}
                </h1>

                <p className="text-2xl font-bold text-[#F2A20C] mt-2">
                    {formatCurrency(product.price)}
                </p>

                <p className="text-gray-600 mt-4 leading-relaxed">
                    {product.description}
                </p>

            </motion.div>

        </div>
    );
}