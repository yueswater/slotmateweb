import { ArrowDown } from 'lucide-react';
import calendarImg from '../../assets/images/calendar.png';

export default function Hero() {
    return (
        <div className="min-h-screen bg-base-200 relative flex items-center justify-center overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">

                <div className="flex-1 w-full flex justify-center lg:justify-end">
                    <div className="relative w-64 sm:w-80 md:w-96 lg:w-[32rem]">
                        <div className="absolute inset-0 bg-neutral rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                        <img
                            src={calendarImg}
                            alt="Office Hour Booking"
                            className="relative w-full drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out object-contain"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 z-10">
                    <h1 className="flex flex-col text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.85] text-base-content tracking-tighter italic uppercase">
                        <span>Book Your</span>
                        <span className="text-neutral mt-2">Office Hour</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-base-content/70 leading-relaxed max-w-md md:max-w-lg lg:max-w-xl font-medium">
                        Check the available slots below and sign in to secure your consultation time.
                        Available every Monday and Friday afternoon.
                    </p>

                    <div className="pt-2">
                        <a
                            href="#slot-list"
                            className="btn btn-neutral btn-lg px-12 text-base-100 shadow-xl rounded-none font-black italic uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all"
                        >
                            Book Now
                        </a>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 left-0 right-0 mx-auto w-fit flex flex-col items-center gap-3 text-base-content/30 animate-bounce cursor-pointer z-20">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase italic hidden sm:block">Scroll Down</span>
                <a
                    href="#slot-list"
                    className="p-3 bg-base-100/50 backdrop-blur-sm rounded-full hover:bg-neutral hover:text-white transition-all duration-300 shadow-lg border border-base-content/5"
                >
                    <ArrowDown size={24} strokeWidth={3} />
                </a>
            </div>
        </div>
    );
}