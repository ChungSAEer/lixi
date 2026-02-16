"use client";

import { AnimatedIcon } from "@/components/common/AnimatedIcon";
import { MorphingText } from "@/components/ui/morphing-text";
import { formatCurrency } from "@/lib/price.helper";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SparklesText } from "@/components/ui/sparkles-text";
import { ShinyButton } from "@/components/ui/shiny-button";
import { useRouter } from "next/navigation";
import { HASH_PRICE, ListIconTet } from "@/constants";
import { ConfigProvider, Slider as SliderAntd } from 'antd';

const texts = [
    "Chúc mừng năm mới!",
    "An khang thịnh vượng!",
    "Vạn sự như ý!",
    "Sức khỏe dồi dào!",
    "Phát tài phát lộc!",
    "Hạnh phúc tràn đầy!",
    "Công danh thuận lợi!",
    "Gia đình ấm êm!",
    "Năm mới vui vẻ!",
];

export default function Home() {
    const [icons, setIcons] = useState<React.ReactElement[]>([]);
    const [amountRange, setAmountRange] = useState([10000, 50000]);
    const { push } = useRouter();

    useEffect(() => {
        const newIcons = Array.from({ length: 25 }, (_, i) => {
            const RandomIcon =
                ListIconTet[Math.floor(Math.random() * ListIconTet.length)];
            const size = Math.floor(Math.random() * (56 - 38 + 1)) + 38;
            return (
                <AnimatedIcon key={i}>
                    <RandomIcon width={size} height={size} />
                </AnimatedIcon>
            );
        });
        setIcons(newIcons);
    }, []);

    const handleRandom = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const from =
            HASH_PRICE[(amountRange[0] / 1000) as keyof typeof HASH_PRICE];

        const to =
            HASH_PRICE[(amountRange[1] / 1000) as keyof typeof HASH_PRICE];
        if (from && to) {
            fetch('/api/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: [amountRange[0] / 1000, amountRange[1] / 1000] })
            }).then((res) => res.json()).then((data) => {
                push(`/${data.id}`, undefined);
            });
            // 
        }
    }, [amountRange, push]);

    return (
        <>
            <div className="absolute top-0 left-0 right-0 bottom-0 z-[10]">
                {icons}
            </div>
            <MorphingText texts={texts} className="font-pacifico z-[1]" />
            <div className="h-32"></div>
            <motion.div
                className="px-4 py-10 rounded-md bg-yellow-300 z-[999] w-1/3 min-w-[360px] shadow-lg flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85 }}
            >
                <form onSubmit={handleRandom} className="flex flex-col items-center w-full">
                    <SparklesText
                        text="Lì Xì Ngay!"
                        className="mb-6 text-[#FF4848]"
                    />
                    <ConfigProvider theme={{
                        components: {
                            Slider: {
                                trackBg: '#FF4848',
                                trackHoverBg: '#FF4848',
                                railSize: 6,
                                handleColor: '#EB5A3C',
                                handleActiveColor: '#8E1616',

                            },
                        },
                        token: {
                            colorPrimaryBorderHover: '#FF4848',
                        },
                    }}>
                        <SliderAntd range min={10000} max={50000} step={5000} value={amountRange} disabled className="w-full" />
                    </ConfigProvider>
                    <div className="flex justify-between text-black my-4 w-full font-pacifico text-2xl">
                        <span>{formatCurrency(amountRange[0])} </span>
                        <span>{formatCurrency(amountRange[1])}</span>
                    </div>
                    <ShinyButton type="submit" className="mt-2 font-mono ">
                        vào ngay
                    </ShinyButton>
                    <div
                        className="cf-turnstile mt-2"
                        data-sitekey="0x4AAAAAAA6VRM7hf-jlCBVw"
                        data-callback="javascriptCallback"
                        data-theme="light"
                    ></div>
                </form>
            </motion.div>
        </>
    );
}
