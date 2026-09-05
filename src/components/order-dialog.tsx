import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Copy } from "lucide-react";

import { supabase, type Product } from "@/lib/supabase";
import { notifyNewOrder } from "@/lib/order-notify";
import { BANK_INFO } from "@/lib/bank-info";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const orderFormSchema = z.object({
  buyerName: z.string().trim().min(1, "이름을 입력해주세요").max(50),
  buyerPhone: z.string().trim().min(9, "연락처를 확인해주세요").max(20),
  quantity: z.coerce.number().int().min(1, "1개 이상 입력해주세요"),
  optionNames: z.array(z.string()),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export function OrderDialog({ product, trigger }: { product: Product; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{
    quantity: number;
    total: number;
    optionNames: string[];
  } | null>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { buyerName: "", buyerPhone: "", quantity: 1, optionNames: [] },
  });

  const selectedOptionNames = form.watch("optionNames");
  const quantity = form.watch("quantity") || 1;
  const optionsTotal = product.options
    .filter((o) => selectedOptionNames.includes(o.name))
    .reduce((sum, o) => sum + o.extra_price, 0);
  const unitPrice = product.price + optionsTotal;
  const liveTotal = unitPrice * quantity;

  async function onSubmit(values: OrderFormValues) {
    const optionsSum = product.options
      .filter((o) => values.optionNames.includes(o.name))
      .reduce((sum, o) => sum + o.extra_price, 0);
    const finalUnitPrice = product.price + optionsSum;
    const optionLabel = values.optionNames.join(", ") || null;

    try {
      const { error } = await supabase.from("orders").insert({
        product_id: product.id,
        product_name: product.name,
        unit_price: finalUnitPrice,
        quantity: values.quantity,
        option_name: optionLabel,
        buyer_name: values.buyerName,
        buyer_phone: values.buyerPhone,
      });
      if (error) throw error;

      await notifyNewOrder({
        data: {
          productName: product.name,
          optionName: optionLabel ?? undefined,
          quantity: values.quantity,
          unitPrice: finalUnitPrice,
          buyerName: values.buyerName,
          buyerPhone: values.buyerPhone,
        },
      });

      setPlacedOrder({
        quantity: values.quantity,
        total: finalUnitPrice * values.quantity,
        optionNames: values.optionNames,
      });
    } catch (error) {
      console.error(error);
      toast.error("주문 접수에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      form.reset();
      setPlacedOrder(null);
    }
  }

  function copyAccountNumber() {
    navigator.clipboard.writeText(BANK_INFO.accountNumber);
    toast.success("계좌번호가 복사되었습니다");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {placedOrder ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">주문이 접수되었습니다</DialogTitle>
              <DialogDescription>
                아래 계좌로 입금해주시면 확인 후 발송해드립니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 border border-hairline p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품</span>
                <span className="font-medium">{product.name}</span>
              </div>
              {placedOrder.optionNames.length > 0 ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">옵션</span>
                  <span className="font-medium">{placedOrder.optionNames.join(", ")}</span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span className="text-muted-foreground">수량</span>
                <span className="font-medium">{placedOrder.quantity}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">입금 금액</span>
                <span className="font-bold">₩{placedOrder.total.toLocaleString()}</span>
              </div>
              <div className="hairline-t pt-3">
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
            </div>
            <Button className="w-full" onClick={() => handleOpenChange(false)}>
              확인
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">주문하기</DialogTitle>
              <DialogDescription>
                {product.name} · ₩{product.price.toLocaleString()} / {product.unit}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {product.options.length > 0 ? (
                  <FormField
                    control={form.control}
                    name="optionNames"
                    render={() => (
                      <FormItem>
                        <FormLabel>추가 옵션</FormLabel>
                        <div className="space-y-2 border border-hairline p-3">
                          {product.options.map((o) => (
                            <label
                              key={o.name}
                              className="flex cursor-pointer items-center justify-between text-sm"
                            >
                              <span className="flex items-center gap-2">
                                <Checkbox
                                  checked={selectedOptionNames.includes(o.name)}
                                  onCheckedChange={(checked) => {
                                    const current = form.getValues("optionNames");
                                    form.setValue(
                                      "optionNames",
                                      checked
                                        ? [...current, o.name]
                                        : current.filter((n) => n !== o.name),
                                    );
                                  }}
                                />
                                {o.name}
                              </span>
                              {o.extra_price ? (
                                <span className="text-muted-foreground">
                                  +{o.extra_price.toLocaleString()}원
                                </span>
                              ) : null}
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}
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
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>수량</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="hairline-t flex items-center justify-between pt-3 text-sm">
                  <span className="text-muted-foreground">
                    {product.shipping_note ?? "배송비 안내 없음"}
                  </span>
                  <span className="font-bold">
                    총 금액 ₩{liveTotal.toLocaleString()}
                  </span>
                </div>
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "처리 중..." : "주문 접수하기"}
                </Button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
