'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ContactSuccessModal from './ContactSuccessModal';

export default function ContactSuccessGate() {
    const search = useSearchParams();
    const router = useRouter();
    const open = search.get('sent') === '1';

    function close() {
        // remove ?sent=1 but keep the hash/route
        const url = new URL(window.location.href);
        url.searchParams.delete('sent');
        router.replace(url.pathname + url.search + url.hash);
    }

    return <ContactSuccessModal open={open} onClose={close} />;
}
