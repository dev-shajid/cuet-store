import { OrderStatus } from '@prisma/client';
import React from 'react'

export default function GetStatusClass(status: OrderStatus) {
    switch (status) {
        case OrderStatus.PENDING:
            return "text-yellow-600 border-yellow-400";
        case OrderStatus.COMPLETED:
            return "text-green-600 border-green-400";
        case OrderStatus.CANCELED:
            return "text-red-600 border-red-400";
        default:
            return "";
    }
}