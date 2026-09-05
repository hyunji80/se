import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Minus, Plus, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart-context";
import { supabase } from "@/lib/supabase";
import { notifyCartOrder } from "@/lib/order-notify";
import { BANK_INFO } from "@/lib/bank-info";
import { DELIVERY_METHODS } from "@/components/order-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "장바구니 — SE 종합물산" }] }),
  component: CartPage,
});

const checkoutSchema = z.object({
  buyerName: z.string().trim().min(1, "이름을 입력해주세요").max(50),
  buyerPhone: z.string().trim().min(9, "연락처를 확인해주세요").max(20),
});
type CheckoutValues = z.infer<typeof checkoutSchema>;

function CartPage() {
  const { items, removeItem, updateQuantity, clear, totalAmount } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<string>(DELIVERY_METHODS[0]);
  const [placed, setPlaced] = useState<{ total: number; count: number } | null>(null);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { buyerName: "", buyerPhone: "" },
  });

  async function onSubmit(values: CheckoutValues) {
    if (items.length === 0) return;
    const groupId = crypto.randomUUID();
    try {
      const { error } = await supabase.from("orders").insert(
        items.map((item) => ({
          product_id: item.productId,
          product_name: item.productName,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          option_name: item.optionNames.join(", ") || null,
          delivery_method: deliveryMethod,
          buyer_name: values.buyerName,
          buyer_phone: values.buyerPhone,
          group_id: groupId,
        })),
      );
      if (error) throw error;

      await notifyCartOrder({
        data: {
          items: items.map((item) => ({
            productName: item.productName,
            optionName: item.optionNames.join(", ") || undefined,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          deliveryMethod,
          buyerName: values.buyerName,
          buyerPhone: values.buyerPhone,
        },
      });

      setPlaced({ total: totalAmount, count: items.length });
      clear();
    } catch (error) {
      console.error(error);
      toast.error("주문 접수에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  function copyAccountNumber() {
    navigator.clipboard.writeText(BANK_INFO.accountNumber);
    toast.success("계좌번호가 복사되었습니다");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="hairline-b sticky top-0 z-50 bg-background/95 px-6 py-5 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-[800px] items-center gap-2">
          <Link
            to="/shop"
            className="link-underline flex items-center gap-1 text-[13px] font-medium text-foreground/70 hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            쇼핑 계속하기
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-6 py-14 sm:px-8">
        <h1 className="font-display text-2xl font-bold">장바구니</h1>

        {placed ? (
          <div className="mt-10 space-y-3 border border-hairline p-6 text-sm">
            <p className="font-display text-lg font-bold">주문이 접수되었습니다</p>
            <p className="text-muted-foreground">
              상품 {placed.count}건 · 총 ₩{placed.total.toLocaleString()}
            </p>
            <div className="hairline-t pt-4">
              <p className="text-muted-foreground">입금 계좌</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-medium">
                  {BANK_INFO.bankName} {BANK_INFO.accountNumber} ({BANK_INFO.accountHolder})
                </span>
                <Button type="button" variant="ghost" size="icon" onClick={copyAccountNumber}>
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>
            <Link to="/shop" className="mt-4 inline-block text-sm font-medium underline">
              쇼핑 계속하기
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-14 flex flex-col items-center gap-4 text-center">
            <p className="text-muted-foreground">장바구니가 비어 있습니다.</p>
            <Link to="/shop" className="text-sm font-medium underline">
              쇼핑하러 가기
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="hairline-b flex gap-4 pb-6">
                  <div className="size-20 shrink-0 overflow-hidden bg-paper">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.productName}</p>
                      {item.optionNames.length > 0 ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          옵션: {item.optionNames.join(", ")}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex size-7 items-center justify-center border border-hairline hover:border-foreground"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex size-7 items-center justify-center border border-hairline hover:border-foreground"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">
                          ₩{(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between text-lg">
              <span className="font-medium">총 금액</span>
              <span className="font-bold">₩{totalAmount.toLocaleString()}</span>
            </div>

            <div className="mt-8">
              <p className="mb-2 text-sm font-medium">배송방법</p>
              <div className="grid grid-cols-3 gap-2">
                {DELIVERY_METHODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDeliveryMethod(m)}
                    className={`border px-2 py-2 text-xs font-medium transition-colors ${
                      deliveryMethod === m
                        ? "border-foreground bg-foreground text-background"
                        : "border-hairline text-foreground/70 hover:border-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <FormField
                  control={form.control}
                  name="buyerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주문자명</FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buyerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>연락처</FormLabel>
                      <FormControl>
                        <Input placeholder="010-0000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-[#CD5C5C] py-6 text-sm tracking-[0.16em] text-white hover:bg-[#b54e4e]"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "처리 중..." : "주문 접수하기"}
                </Button>
              </form>
            </Form>
          </>
        )}
      </main>
    </div>
  );
}
