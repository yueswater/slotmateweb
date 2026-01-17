import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('cupcake');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'cupcake';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'cupcake' ? 'dark' : 'cupcake';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="group flex flex-col items-center gap-1.5 hover:bg-transparent"
        >
            {theme === 'cupcake' ? (
                <>
                    <Sun className="h-5 w-5 text-orange-400" strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase italic tracking-widest text-orange-400 group-hover:opacity-100 transition-opacity">
                        Light
                    </span>
                </>
            ) : (
                <>
                    <Moon className="h-5 w-5 text-yellow-300" strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase italic tracking-widest text-yellow-300 group-hover:opacity-100 transition-opacity">
                        Dark
                    </span>
                </>
            )}
        </button>
    );
}