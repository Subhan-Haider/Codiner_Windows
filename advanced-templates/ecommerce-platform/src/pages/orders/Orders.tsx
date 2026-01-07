import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Eye,
  Download,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Filter
} from "lucide-react";

const mockOrders = [
  {
    id: "#ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 549.97,
    items: [
      { name: "Wireless Bluetooth Headphones", quantity: 2, price: 199.99 },
      { name: "Ergonomic Office Chair", quantity: 1, price: 349.99 }
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
    trackingNumber: "TRK123456789"
  },
  {
    id: "#ORD-2024-002",
    date: "2024-01-12",
    status: "shipped",
    total: 299.99,
    items: [
      { name: "Smart Fitness Watch", quantity: 1, price: 299.99 }
    ],
    shippingAddress: "456 Office Blvd, New York, NY 10002",
    trackingNumber: "TRK987654321"
  },
  {
    id: "#ORD-2024-003",
    date: "2024-01-10",
    status: "processing",
    total: 149.98,
    items: [
      { name: "Organic Coffee Beans", quantity: 2, price: 24.99 },
      { name: "Yoga Mat Premium", quantity: 1, price: 79.99 }
    ],
    shippingAddress: "789 Park Ave, New York, NY 10003",
    trackingNumber: null
  },
  {
    id: "#ORD-2024-004",
    date: "2024-01-08",
    status: "cancelled",
    total: 899.99,
    items: [
      { name: "Professional Camera Lens", quantity: 1, price: 899.99 }
    ],
    shippingAddress: "321 Broadway, New York, NY 10004",
    trackingNumber: null
  }
];

const statusConfig = {
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  shipped: { label: "Shipped", color: "bg-blue-100 text-blue-800", icon: Truck },
  processing: { label: "Processing", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle }
};

export default function Orders() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesTab = activeTab === "all" || order.status === activeTab;

    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusDisplay = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const OrderDetails = ({ order }: { order: typeof mockOrders[0] }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{order.id}</span>
          {getStatusDisplay(order.status)}
        </CardTitle>
        <CardDescription>Ordered on {new Date(order.date).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Items */}
        <div>
          <h4 className="font-medium mb-3">Order Items</h4>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                </div>
                <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Information */}
        <div>
          <h4 className="font-medium mb-3">Shipping Information</h4>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm">{order.shippingAddress}</div>
            {order.trackingNumber && (
              <div className="text-sm text-gray-600 mt-1">
                Tracking: <span className="font-mono">{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Order Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
          {order.status === "delivered" && (
            <Button variant="outline" size="sm">
              Write Review
            </Button>
          )}
          {order.status === "processing" && (
            <Button variant="outline" size="sm">
              Cancel Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">Track and manage your order history</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders by ID or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {selectedOrder ? (
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedOrder(null)}
                  className="mb-4"
                >
                  ← Back to Orders
                </Button>
                <OrderDetails order={selectedOrder} />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusDisplay(order.status)}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                                {order.status === "processing" && (
                                  <Button variant="ghost" size="sm" className="text-red-600">
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{mockOrders.length}</p>
                </div>
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">
                    {mockOrders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold">
                    {mockOrders.filter(o => o.status === 'shipped').length}
                  </p>
                </div>
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">
                    ${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </p>
                </div>
                <RefreshCw className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
