'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { OrderDetails } from '@/types/type'
import GetStatusClass from '@/components/GetStatusClass'
import { OrderStatus } from '@prisma/client'
import { toast } from '@/hooks/use-toast'
import { updateOrderItemStatus } from '@/lib/action'
import BlurImage from '@/components/BlurImage'

const SellingOrderForm = ({ order: initialOrder }: { order: OrderDetails }) => {
    const [order, setOrder] = useState(initialOrder)

    if (order === null) return null

    const handleStatusChange = async (orderItemId: string, newStatus: OrderStatus) => {
        const result = await updateOrderItemStatus(orderItemId, newStatus)
        if (result.success) {
            setOrder(prevOrder => ({
                ...prevOrder,
                order_items: prevOrder.order_items.map(item =>
                    item.id === orderItemId ? { ...item, status: newStatus } : item
                )
            }))
            toast({
                title: "✅ Status updated",
                description: `Order item status changed to ${newStatus}`,
            })
        } else {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            })
        }
    }

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-primary">
                        Order Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Customer</p>
                        <p className="text-base font-semibold">{order?.user?.name}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <p className="text-base font-semibold">{order?.user_phone}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                        <p className="text-base font-semibold">{formatCurrency(order?.total_amount)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p className="text-base font-semibold">{order?.address}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Created At</p>
                        <p className="text-base font-semibold">
                            {new Date(order?.created_at).toLocaleString()}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-primary">
                        Order Items
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Product Image</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order?.order_items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.product_name}</TableCell>
                                    <TableCell>
                                        {
                                            item.product.images?.[0]?.url ?
                                                <BlurImage
                                                    src={item.product.images?.[0]?.url}
                                                    alt={item.product_name}
                                                    className="w-10 h-10 rounded-md"
                                                /> : null
                                        }
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{formatCurrency(item.price)}</TableCell>
                                    <TableCell>{formatCurrency(item.total_amount)}</TableCell>
                                    <TableCell>
                                        <Select
                                            onValueChange={(value: OrderStatus) => handleStatusChange(item.id, value)}
                                            defaultValue={item.status}
                                            disabled={item.status === 'COMPLETED'}
                                        >
                                            <SelectTrigger className={`capitalize w-auto h-7 text-sm flex disabled:opacity-100 ${GetStatusClass(item.status)}`}>
                                                {item.status}
                                            </SelectTrigger>
                                            <SelectContent>
                                                {item.status === 'PENDING' && (
                                                    <>
                                                        <SelectItem value="PROCESSING">Processing</SelectItem>
                                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                                    </>
                                                )}
                                                {item.status === 'PROCESSING' && (
                                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default SellingOrderForm

