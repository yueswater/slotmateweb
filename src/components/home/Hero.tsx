import { ArrowDown } from 'lucide-react';
import calendarImg from '../../assets/images/calendar.png';

export default function Hero() {
    return (
        <div className="hero min-h-screen bg-base-200 relative">
            <div className="hero-content flex-col lg:flex-row-reverse gap-8 lg:gap-16 px-8 max-w-7xl mx-auto w-full">

                <div className="flex-1 flex justify-center lg:justify-end">
                    <img
                        src={calendarImg}
                        alt="Office Hour Booking"
                        className="max-w-xs md:max-w-sm lg:max-w-md w-full drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out"
                    />
                </div>

                <div className="flex-1 text-center lg:text-left space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[0.9] text-base-content tracking-tighter italic uppercase">
                        Book Your
                        <span className="block text-neutral/80 mt-2">Office Hour</span>
                    </h1>

                    <p className="py-2 text-lg md:text-xl text-base-content/70 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                        Check the available slots below and sign in to secure your consultation time.
                        Available every Monday and Friday afternoon to help you excel.
                    </p>

                    <div className="pt-2">
                        <a href="#slot-list" className="btn btn-neutral px-10 text-base-100 shadow-xl rounded-none font-black italic uppercase tracking-widest">
                            Book Now
                        </a>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-base-content/40 animate-bounce cursor-pointer">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">Scroll Down</span>
                <a href="#slot-list" className="p-2 bg-base-100/30 rounded-full hover:bg-base-100 transition-colors">
                    <ArrowDown size={20} className="text-neutral" />
                </a>
            </div>
        </div>
    );
}