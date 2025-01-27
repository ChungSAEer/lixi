'use client';

import React, { useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ShinyButton } from '../ui/shiny-button'
import { motion } from "framer-motion";
import { Settings } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getItem, setItem } from '@/lib/localStorage.helper';
import { KEY_SETTING, SEPARATE_SETTINGS } from '@/constants';

interface IBank {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
    short_name: string;
    support: number;
    isTransfer: number;
    swift_code: string;
}

export default function AddBankAccount() {
    const [banks, setBanks] = React.useState<IBank[]>([]);

    const [selectedBank, setSelectedBank] = React.useState<string | undefined>(() => {
        const setting = getItem<string>(KEY_SETTING);
        if (setting) {
            const [code, accountNumber] = setting.split(SEPARATE_SETTINGS);
            if (!code || !accountNumber) {
                return undefined;
            }
            return setting.split(SEPARATE_SETTINGS)[0];
        }
        return undefined;
    });

    const [accountNumber, setAccountNumber] = React.useState<string>(() => {
        const setting = getItem<string>(KEY_SETTING);
        if (setting) {
            const accountNumber = setting.split(SEPARATE_SETTINGS)[1];
            return accountNumber !== undefined ? accountNumber : "";
        }
        return "";
    });
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        fetch("https://api.vietqr.io/v2/banks").then((res) => {
            res.json().then((data) => {
                setBanks(data?.data);
            });
        });
    }, []);

    const handleSave = useCallback(() => {
        if (!selectedBank || !accountNumber) {
            return;
        }

        setItem(KEY_SETTING, `${selectedBank}${SEPARATE_SETTINGS}${accountNumber}`);
        setVisible(false);
    }, [selectedBank, accountNumber]);

    return (
        <Dialog open={visible} onOpenChange={setVisible}>
            <DialogTrigger asChild>
                <motion.div
                    className="absolute left-10 top-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Settings
                        size={32}
                        color="white"
                        className="cursor-pointer"
                    />
                </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cài đặt</DialogTitle>
                    <DialogDescription>
                        Cài đặt tài khoản ngân hàng để nhận lì xì nhé 🧧
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn ngân hàng " />
                        </SelectTrigger>
                        <SelectContent className="absolute -bottom-20">
                            <SelectGroup>
                                {banks.map((bank) => (
                                    <SelectItem key={bank.id} value={bank.code}>
                                        <div className="flex items-center space-x-2">
                                            <Image
                                                src={bank.logo}
                                                alt={bank.name}
                                                width={40}
                                                height={30}
                                                className="w-8 h-8"
                                            />
                                            <span>{bank.shortName}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Nhập số tài khoản"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus-visible:border-red-400 focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    />
                </div>
                <DialogFooter>
                    <ShinyButton onClick={handleSave}>Lưu ngay</ShinyButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
