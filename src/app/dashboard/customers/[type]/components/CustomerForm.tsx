import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils"; // Assume a utility for formatting currency
import { Order, OrderItem, OrderStatus } from '@prisma/client';
import { OrderDetails } from '@/types/type';
import GetStatusClass from '@/components/GetStatusClass';

const CustomerForm = ({ order }:{order: OrderDetails}) => {
    if(order === null) return null;
    return (
        <div className="p-6 space-y-6">
            {/* Order Information */}
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
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge variant="outline" className={`capitalize ${GetStatusClass(order?.status)}`}>
                            {order?.status}
                        </Badge>
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

            {/* Order Items */}
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
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order?.order_items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.product_name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{formatCurrency(item.price)}</TableCell>
                                    <TableCell>{formatCurrency(item.total_amount)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};


export default CustomerForm;
