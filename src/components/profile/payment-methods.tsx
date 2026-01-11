"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Edit, Trash2, Shield, Wallet } from "lucide-react";

interface PaymentMethodsProps {
  userId: string;
}

export function PaymentMethods({ userId }: PaymentMethodsProps) {
  // Mock payment methods - in real app, fetch from API
  const [paymentMethods] = useState([
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ]);

  const getCardBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "bg-blue-600";
      case "mastercard":
        return "bg-red-600";
      case "amex":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Manage your saved payment methods for faster checkout
            </CardDescription>
          </div>
          <Button className="bg-crimson-600 hover:bg-crimson-700 border-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                No payment methods saved
              </h3>
              <p className="text-muted-foreground mb-4">
                Add a payment method for faster checkout
              </p>
              <Button className="bg-crimson-600 hover:bg-crimson-700 border-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Payment Method
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-6 ${getCardBrandColor(
                          method.brand
                        )} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {method.brand.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">
                          •••• •••• •••• {method.last4}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expires{" "}
                          {method.expiryMonth.toString().padStart(2, "0")}/
                          {method.expiryYear}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs border-0">
                          Default
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 border-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 border-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-0 bg-background"
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet & UPI Options */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Digital Wallets & UPI
          </CardTitle>
          <CardDescription>
            Quick payment options for Indian customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Paytm Wallet", icon: "₹", enabled: false },
              { name: "PhonePe", icon: "📱", enabled: true },
              { name: "Google Pay", icon: "G", enabled: true },
              { name: "Amazon Pay", icon: "A", enabled: false },
              { name: "Mobikwik", icon: "M", enabled: false },
              { name: "Freecharge", icon: "F", enabled: false },
            ].map((wallet) => (
              <div
                key={wallet.name}
                className="flex items-center justify-between p-3 bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-crimson-600 text-white flex items-center justify-center text-sm font-bold">
                    {wallet.icon}
                  </div>
                  <span className="font-medium">{wallet.name}</span>
                </div>
                <div
                  className={`w-10 h-6 ${
                    wallet.enabled ? "bg-crimson-600" : "bg-muted"
                  } transition-colors cursor-pointer`}
                >
                  <div
                    className={`w-4 h-4 bg-white mt-1 transition-transform ${
                      wallet.enabled ? "translate-x-5" : "translate-x-1"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-600 mb-1">
                Your payments are secure
              </h4>
              <p className="text-sm text-muted-foreground">
                We use bank-level encryption and never store your card details
                on our servers. All transactions are processed through secure
                payment gateways.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
