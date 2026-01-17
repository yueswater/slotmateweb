import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import SlotList from '../components/home/SlotList';
import NotificationModal, { type ModalVariant } from '../components/common/NotificationModal';

export default function HomePage() {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'info' as ModalVariant
    });

    const triggerModal = (title: string, message: string, variant: ModalVariant) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            variant
        });
    };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-base-200">
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>

            <section className="snap-start relative">
                <Hero />
            </section>

            <section id="slot-list" className="snap-start min-h-screen bg-base-100 pt-20">
                <div className="container mx-auto">
                    <SlotList onNotify={triggerModal} />
                </div>
            </section>

            <section className="snap-start">
                <Footer />
            </section>

            <NotificationModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                message={modalConfig.message}
                variant={modalConfig.variant}
            />
        </div>
    );
}