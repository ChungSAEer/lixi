"use client";

import { AnimatedIcon } from "@/components/common/AnimatedIcon";
import { KEY_SETTING, ListIconTet, SEPARATE_SETTINGS } from "@/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Share, VolumeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AddBankAccount from "@/components/common/AddBankAccount";
import { Toaster } from "@/components/ui/toaster";
import { getItem } from "@/lib/localStorage.helper";
import { ScratchToReveal } from "@/components/ui/scratch-to-reveal";
import Image from 'next/image';
import { formatCurrency } from "@/lib/price.helper";
import { Tooltip } from "antd";

export default function PageRandom({
    params,
}: {
    params: Promise<{ room: string }>
}) {
    const [icons, setIcons] = useState<React.ReactElement[]>([]);
    const [iconsQr, setIconsQr] = useState<React.ReactElement[]>([]);
    const [visibleVolume, setVisibleVolume] = useState(true);
    const { toast } = useToast();
    const [imgQr, setImgQr] = useState<string | null>(null);
    const [money, setMoney] = useState<number>();
    const qrRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const audio = new Audio("/thu-y.mp3");
        audio.loop = true;

        const handleUserInteraction = () => {
            audio.play();
            setVisibleVolume(false);
            window.removeEventListener("click", handleUserInteraction);
        };

        window.addEventListener("click", handleUserInteraction);
        return () => {
            audio.pause();
            window.removeEventListener("click", handleUserInteraction);
        };
    }, []);

    const handleOpenLixi = useCallback(async () => {
        const setting = getItem<string>(KEY_SETTING);
        if (!setting) {
            toast({
                variant: "destructive",
                title: "Lưu ý",
                description: "Bạn chưa thiết lập tài khoản nhận lì xì 😁",
            });
            return;
        }
        const [code, accountNumber] = setting.split(SEPARATE_SETTINGS);
        if (!code || !accountNumber) {
            toast({
                variant: "destructive",
                title: "Lưu ý",
                description: "Bạn chưa thiết lập tài khoản nhận lì xì 😁",
            });
            return;
        }
        const id = (await params).room;
        const response = await fetch(`/api/get-lixi`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, accountId: accountNumber }),
        });
        const data = await response.json();
        if (data.message) {
            toast({
                variant: "destructive",
                title: "Hmm",
                description: data.message,
            });
            return;
        }
        setMoney(data.money);
        setImgQr(`https://qr.sepay.vn/img?bank=${code}&acc=${accountNumber}&template=qronly&amount=${data.money}&des=CHUC MUNG NAM MOI 2025`);

    }, [toast, params]);

    const handleCompleted = useCallback(() => {
        const newIcons = Array.from({ length: 5 }, (_, i) => {
            const RandomIcon =
                ListIconTet[Math.floor(Math.random() * ListIconTet.length)];
            const size = Math.floor(Math.random() * (56 - 38 + 1)) + 38;
            return (
                <AnimatedIcon key={i} constraints={qrRef.current?.getBoundingClientRect()}>
                    <RandomIcon width={size} height={size} />
                </AnimatedIcon>
            );
        });
        console.log();

        setIconsQr(newIcons);
    }, []);

    const handleShareLink = useCallback(() => {
        try {
            navigator.clipboard.writeText(window.location.href);
            navigator.share({
                title: "Lì xì túi mù",
                text: "Chúc mừng năm mới 2025",
                url: window.location.href,
            })
        } catch {
            toast({
                variant: "destructive",
                title: "Báo",
                description: "Chức năng chia sẻ không khả dụng trên thiết bị này",
            });
        }
    }, [toast]);

    return (
        <>
            <Toaster />
            <div className="absolute top-0 left-0 right-0 bottom-0 ">
                {icons}
            </div>
            <AnimatePresence>
                {visibleVolume && (
                    <motion.div
                        className="absolute right-10 top-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <VolumeOff
                            size={32}
                            color="white"
                            className="cursor-pointer"
                            onClick={() => setVisibleVolume(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {!visibleVolume && (<motion.div
                className="absolute right-10 top-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <Tooltip title="Chia sẻ và copy" placement="left">
                    <Share size={32}
                        onClick={handleShareLink}
                        color="white"
                        className="cursor-pointer" />
                </Tooltip>
            </motion.div>)}
            <AddBankAccount />
            <h1 className="text-4xl font-pacifico text-white z-[9] mb-6">
                Lì xì túi mù
            </h1>
            <AnimatePresence>
                {!imgQr && (<motion.div
                    key="button"
                    initial={{ height: 60, opacity: 0 }}
                    animate={{ height: 200, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        "w-[300px] bg-[#FF3B3B] hover:bg-[#FF2424] transition-colors",
                        "border-2 border-[#FFD700] shadow-lg cursor-pointer",
                        "relative overflow-hidden transform hover:scale-105 transition-transform",
                        "flex items-center justify-center"
                    )}
                >
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FFD700]" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FFD700]" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#FFD700]" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#FFD700]" />

                    <div className="w-16 h-16 rounded-full border-2 border-[#FFD700] flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-2 border-[#FFD700] bg-[#FF3B3B]" />
                    </div>

                    <button className="absolute font-pacifico bottom-4 w-full text-center text-[#FFD700] font-bold text-xl hover:text-[#FFF7CC] transition-colors" onClick={handleOpenLixi} >
                        Nhận Lì Xì Ngay
                    </button>
                </motion.div>)}
                <AnimatePresence>
                    {(imgQr && money) && (
                        <motion.div
                            ref={qrRef}
                            key={'qr'}
                            initial={{ height: 300, opacity: 0 }}
                            animate={{ height: 400, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className={cn(
                                "w-[300px] bg-white transition-colors rounded-sm",
                                "border-2 border-[#FFD700] shadow-lg cursor-pointer",
                                "relative overflow-hidden transform hover:scale-105 transition-transform",
                                "flex items-center justify-center"
                            )}
                        >
                            <ScratchToReveal height={400} width={300} onComplete={handleCompleted} gradientColors={['#F93827', '#FF9D23', '#F93827']} minScratchPercentage={90} className="flex flex-col items-center justify-center overflow-hidden">
                                {iconsQr}
                                <Image src={imgQr} alt="qr" width={200} height={300} className="z-[999]" />
                                <p className="text-2xl font-bold text-red-500 font-pacifico mt-2">{formatCurrency(money)}</p>
                            </ScratchToReveal>
                        </motion.div>
                    )}
                </AnimatePresence>
            </AnimatePresence>
        </>
    );
}
