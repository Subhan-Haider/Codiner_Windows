import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Truck,
  Shield,
  Lock,
  ArrowLeft,
  Check,
  AlertCircle,
  MapPin,
  User,
  Phone
} from "lucide-react";

const mockCartItems = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 199.99,
    quantity: 2,
    image: "https://via.placeholder.com/80x80"
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: 349.99,
    quantity: 1,
    image: "https://via.placeholder.com/80x80"
  }
];

const shippingAddresses = [
  {
    id: "1",
    name: "John Doe",
    address: "123 Main St, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567",
    isDefault: true
  },
  {
    id: "2",
    name: "John Doe",
    address: "456 Office Blvd, Suite 200",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    country: "United States",
    phone: "+1 (555) 123-4567",
    isDefault: false
  }
];

const paymentMethods = [
  {
    id: "card",
    type: "Credit/Debit Card",
    icon: CreditCard,
    description: "Pay with Visa, Mastercard, or American Express"
  },
  {
    id: "paypal",
    type: "PayPal",
    icon: CreditCard,
    description: "Fast, secure checkout with PayPal"
  }
];

export default function Checkout() {
  const [activeTab, setActiveTab] = useState("information");
  const [selectedShippingAddress, setSelectedShippingAddress] = useState("1");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form data
  const [shippingForm, setShippingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleShippingFormChange = (field: string, value: string) => {
    setShippingForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentFormChange = (field: string, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Handle successful order
    console.log("Order placed successfully");
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/cart">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="information" className="text-xs">
                  <span className="hidden sm:inline">Contact & Shipping</span>
                  <span className="sm:hidden">Info</span>
                </TabsTrigger>
                <TabsTrigger value="payment" className="text-xs">
                  Payment
                </TabsTrigger>
                <TabsTrigger value="review" className="text-xs">
                  Review
                </TabsTrigger>
              </TabsList>

              <TabsContent value="information" className="space-y-6 mt-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={shippingForm.firstName}
                          onChange={(e) => handleShippingFormChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={shippingForm.lastName}
                          onChange={(e) => handleShippingFormChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingForm.email}
                        onChange={(e) => handleShippingFormChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={shippingForm.phone}
                        onChange={(e) => handleShippingFormChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Saved Addresses */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Select a shipping address</Label>
                      <RadioGroup value={selectedShippingAddress} onValueChange={setSelectedShippingAddress}>
                        {shippingAddresses.map((address) => (
                          <div key={address.id} className="flex items-start space-x-3">
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor={address.id} className="cursor-pointer">
                                <div className="p-3 border rounded-lg hover:bg-gray-50">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium">{address.name}</div>
                                      <div className="text-sm text-gray-600">
                                        {address.address}<br />
                                        {address.city}, {address.state} {address.zipCode}<br />
                                        {address.country}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        {address.phone}
                                      </div>
                                    </div>
                                    {address.isDefault && (
                                      <Badge variant="secondary">Default</Badge>
                                    )}
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Separator />

                    {/* New Address Form */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Or enter a new address</Label>

                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          placeholder="123 Main Street"
                          value={shippingForm.address}
                          onChange={(e) => handleShippingFormChange("address", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={shippingForm.city}
                            onChange={(e) => handleShippingFormChange("city", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={shippingForm.state}
                            onChange={(e) => handleShippingFormChange("state", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={shippingForm.zipCode}
                            onChange={(e) => handleShippingFormChange("zipCode", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={shippingForm.country}
                            onChange={(e) => handleShippingFormChange("country", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={() => setActiveTab("payment")} className="w-full">
                  Continue to Payment
                </Button>
              </TabsContent>

              <TabsContent value="payment" className="space-y-6 mt-6">
                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <div key={method.id} className="flex items-center space-x-3">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                              <div className="p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                  <Icon className="w-6 h-6 text-gray-600" />
                                  <div>
                                    <div className="font-medium">{method.type}</div>
                                    <div className="text-sm text-gray-600">{method.description}</div>
                                  </div>
                                </div>
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Payment Details */}
                {selectedPaymentMethod === "card" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Details</CardTitle>
                      <CardDescription>Your payment information is secure and encrypted</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentForm.cardNumber}
                          onChange={(e) => handlePaymentFormChange("cardNumber", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentForm.expiryDate}
                            onChange={(e) => handlePaymentFormChange("expiryDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentForm.cvv}
                            onChange={(e) => handlePaymentFormChange("cvv", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          placeholder="John Doe"
                          value={paymentForm.cardholderName}
                          onChange={(e) => handlePaymentFormChange("cardholderName", e.target.value)}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="savePayment"
                          checked={savePaymentMethod}
                          onCheckedChange={(checked) => setSavePaymentMethod(checked as boolean)}
                        />
                        <Label htmlFor="savePayment" className="text-sm">
                          Save this payment method for future purchases
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="billingSame"
                        checked={billingSameAsShipping}
                        onCheckedChange={(checked) => setBillingSameAsShipping(checked as boolean)}
                      />
                      <Label htmlFor="billingSame" className="text-sm">
                        Same as shipping address
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setActiveTab("information")} className="flex-1">
                    Back to Information
                  </Button>
                  <Button onClick={() => setActiveTab("review")} className="flex-1">
                    Continue to Review
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="review" className="space-y-6 mt-6">
                {/* Order Review */}
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                    <CardDescription>Please review your order details before placing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact & Shipping */}
                    <div>
                      <h4 className="font-medium mb-2">Contact & Shipping</h4>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <div>{shippingForm.firstName} {shippingForm.lastName}</div>
                        <div>{shippingForm.email}</div>
                        <div>{shippingForm.phone}</div>
                        <div className="mt-2">
                          {shippingForm.address}<br />
                          {shippingForm.city}, {shippingForm.state} {shippingForm.zipCode}
                        </div>
                      </div>
                    </div>

                    {/* Payment */}
                    <div>
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedPaymentMethod === "card" ? "Credit/Debit Card" : "PayPal"}
                      </div>
                    </div>

                    <Separator />

                    {/* Terms Agreement */}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm leading-5">
                        I agree to the{" "}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setActiveTab("payment")} className="flex-1">
                    Back to Payment
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={!agreeToTerms || isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {mockCartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 mt-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>Free shipping on orders over $100</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
