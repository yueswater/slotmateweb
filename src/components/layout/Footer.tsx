export default function Footer() {
    return (
        <footer className="footer footer-center p-8 bg-base-300 text-base-content mt-auto">
            <aside>
                <p className="font-black italic uppercase tracking-widest text-xs opacity-50">
                    © {new Date().getFullYear()} SlotMate. Booking System
                </p>
            </aside>
        </footer>
    );
}