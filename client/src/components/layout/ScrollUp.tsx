"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";

export function ScrollUp() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function onScroll() {
            setVisible(window.scrollY > 200);
        }

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Button
            type="button"
            aria-label="Voltar ao topo"
            title="Voltar ao topo"
            onClick={handleClick}
            className={`cursor-pointer group fixed right-4 bottom-6 z-50 inline-flex items-center justify-center rounded-full bg-white shadow-lg p-3 h-10 w-10
        hover:bg-[#F28B0C] transition-colors duration-300
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
            <ArrowUp className="w-5 h-5 text-[#F28B0C] group-hover:text-white transition-colors duration-300" />
        </Button>
    );
}