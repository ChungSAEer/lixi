import { useState, useEffect } from "react";

export const AnimatedIcon = ({ children, constraints }: {
    children: React.ReactNode, constraints?: {
        bottom: number;
        left: number;
        right: number;
        top: number;
        width: number;
        height: number;
    }
}) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!constraints) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            setPosition({ x, y });
        } else {
            const minX = constraints.left;
            const maxX = constraints.right - constraints.width;
            const minY = constraints.top;
            const maxY = constraints.bottom - constraints.height;

            if (maxX >= minX && maxY >= minY) {
                const x = minX + Math.random() * (maxX - minX);
                const y = minY + Math.random() * (maxY - minY);
                setPosition({ x, y });
            } else {
                console.error("Invalid constraints: Phạm vi không hợp lệ");
            }
        }
    }, [constraints]);

    return (
        <div
            className="animatedIcon"
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                animationDuration: `${Math.random() * 2 + 1}s`,
            }}
        >
            {children}
        </div>
    );
};
