import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormData>({
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerAddress: "",
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_address: data.customerAddress,
          total_amount: total,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        artwork_id: item.artwork.id,
        quantity: item.quantity,
        unit_price: item.product.base_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success("Order placed successfully!");
      clearCart();
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium">Checkout</h1>
          <Button 
            variant="ghost" 
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/cart")}
          >
            <Icons.chevronLeft className="w-4 h-4 mr-2" />
            Return to cart
          </Button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Left Column - Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Contact information</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            type="email"
                            className="h-11"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-6 border-t">
                    <h2 className="text-lg font-medium mb-4">Shipping address</h2>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John Smith" 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123 Main St, City, State, Postcode" 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-6 lg:hidden">
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Icons.stripe className="mr-2 h-5 w-5" />
                          Pay with Stripe
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-medium mb-4">Order summary</h2>
              <div className="divide-y">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.artwork.id}`}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-md border overflow-hidden">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 truncate">
                          Artwork: {item.artwork.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          By {item.artwork.student.name}
                        </p>
                        <p className="mt-1 font-medium">
                          {formatPrice(item.product.base_price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-base">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-base font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Including GST
                </p>
              </div>

              <div className="mt-6 hidden lg:block">
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full h-12 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Icons.stripe className="mr-2 h-5 w-5" />
                      Pay with Stripe
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
