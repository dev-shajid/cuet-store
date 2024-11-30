'use client'

import React, { useEffect, useState } from 'react'
import Modal from './modal';
import { Button } from '@/components/ui/button';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    title?: string;
    description?: string;
}

export default function AlertModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    title = "Are you sure?",
    description = "This action cannot be undone."
}: AlertModalProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;
    return (
        <Modal
            title={title}
            description={description}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                <Button disabled={isLoading} variant='outline' onClick={onClose}>Cancel</Button>
                <Button disabled={isLoading} onClick={onConfirm}>Confirm</Button>
            </div>
        </Modal>
    )
}
