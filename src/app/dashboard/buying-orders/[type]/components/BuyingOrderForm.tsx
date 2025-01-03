import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils"; // Assume a utility for formatting currency
import { Order, OrderItem, OrderStatus } from '@prisma/client';
import { OrderDetails } from '@/types/type';
import GetStatusClass from '@/components/GetStatusClass';
import BlurImage from '@/components/BlurImage';
import Link from 'next/link';

const BuyingOrderForm = ({ order }: { order: OrderDetails }) => {
    if (order === null) return null;
    console.log(order?.order_items[0])
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
                    {/* <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge variant="outline" className={`capitalize ${GetStatusClass(order?.status)}`}>
                            {order?.status}
                        </Badge>
                    </div> */}
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
                                <TableHead>Product</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Seller</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order?.order_items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Link target='_blank' className='text-blue-400' href={`/products/${item.product.id}`}>
                                            {item.product_name}
                                        </Link>
                                    </TableCell>
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
                                    <TableCell>
                                        <div className='flex flex-col gap-1'>
                                            <span className='font-semibold'>{item.product.seller?.name}</span>
                                            <span className='text-muted-foreground'>{item.product.seller?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{formatCurrency(item.price)}</TableCell>
                                    <TableCell>{formatCurrency(item.total_amount)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`capitalize ${GetStatusClass(item.status)}`}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default BuyingOrderForm;
