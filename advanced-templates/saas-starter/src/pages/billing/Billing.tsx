import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Check,
  X,
  AlertTriangle,
  Receipt,
  Settings,
  Plus
} from "lucide-react";

const currentPlan = {
  name: "Pro",
  price: 29,
  billingCycle: "monthly",
  features: [
    "Up to 10 team members",
    "100GB storage",
    "Advanced analytics",
    "Priority support",
    "API access"
  ],
  usage: {
    teamMembers: { used: 7, limit: 10 },
    storage: { used: 67, limit: 100 },
    apiCalls: { used: 8500, limit: 10000 }
  }
};

const billingHistory = [
  {
    id: "INV-2024-001",
    date: "2024-01-15",
    amount: 29.00,
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#"
  },
  {
    id: "INV-2024-002",
    date: "2023-12-15",
    amount: 29.00,
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#"
  },
  {
    id: "INV-2024-003",
    date: "2023-11-15",
    amount: 29.00,
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#"
  }
];

const paymentMethods = [
  {
    id: "card_1",
    type: "Visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true
  },
  {
    id: "card_2",
    type: "Mastercard",
    last4: "8888",
    expiryMonth: 6,
    expiryYear: 2026,
    isDefault: false
  }
];

const availablePlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "Up to 3 team members",
      "5GB storage",
      "Basic analytics",
      "Community support"
    ],
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    description: "For growing teams",
    features: [
      "Up to 10 team members",
      "100GB storage",
      "Advanced analytics",
      "Priority support",
      "API access"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    description: "For large organizations",
    features: [
      "Unlimited team members",
      "1TB storage",
      "Custom analytics",
      "Dedicated support",
      "Advanced security",
      "Custom integrations"
    ],
    popular: false
  }
];

export default function Billing() {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600 mt-1">Manage your subscription, billing, and payment methods</p>
        </div>

        {/* Current Plan Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Plan
                <Badge className="bg-blue-100 text-blue-800">{currentPlan.name}</Badge>
              </CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold">${currentPlan.price}</div>
                  <div className="text-gray-600">per {currentPlan.billingCycle}</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Next billing date: February 15, 2024
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Plan Features</h4>
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Usage Overview</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Team Members</span>
                      <span>{currentPlan.usage.teamMembers.used} / {currentPlan.usage.teamMembers.limit}</span>
                    </div>
                    <Progress value={(currentPlan.usage.teamMembers.used / currentPlan.usage.teamMembers.limit) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage</span>
                      <span>{currentPlan.usage.storage.used}GB / {currentPlan.usage.storage.limit}GB</span>
                    </div>
                    <Progress value={(currentPlan.usage.storage.used / currentPlan.usage.storage.limit) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>API Calls</span>
                      <span>{currentPlan.usage.apiCalls.used.toLocaleString()} / {currentPlan.usage.apiCalls.limit.toLocaleString()}</span>
                    </div>
                    <Progress value={(currentPlan.usage.apiCalls.used / currentPlan.usage.apiCalls.limit) * 100} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Receipt className="w-4 h-4 mr-2" />
                Billing History
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Billing Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Billing Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                      <p className="text-2xl font-bold">$2,450</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">+12.5%</span> from last month
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Subscribers</p>
                      <p className="text-2xl font-bold">1,247</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">+8.2%</span> from last month
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Churn Rate</p>
                      <p className="text-2xl font-bold">2.4%</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">-0.3%</span> from last month
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Charges */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Charges</CardTitle>
                <CardDescription>Your next billing cycle charges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Pro Plan Subscription</div>
                      <div className="text-sm text-gray-600">Monthly subscription</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$29.00</div>
                      <div className="text-sm text-gray-600">Feb 15, 2024</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="font-medium">Total</div>
                    <div className="font-bold text-lg">$29.00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6 mt-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
              <p className="text-gray-600">Upgrade or downgrade your subscription at any time</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600">Most Popular</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      {plan.price > 0 && <span className="text-gray-600">/month</span>}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={plan.id === "pro" ? "default" : "outline"}
                      disabled={plan.id === "pro"}
                    >
                      {plan.id === "pro" ? "Current Plan" : plan.price === 0 ? "Downgrade" : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View and download your past invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingHistory.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg ${
                      method.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                        <div>
                          <div className="font-medium">
                            {method.type} ending in {method.last4}
                          </div>
                          <div className="text-sm text-gray-600">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <Button variant="ghost" size="sm">Edit</Button>
                        {!method.isDefault && (
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>Update your billing information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-gray-600 mt-1">
                    123 Main St<br />
                    New York, NY 10001<br />
                    United States
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Update Billing Address
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
