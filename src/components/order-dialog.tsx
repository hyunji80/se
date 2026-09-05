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

export const DELIVERY_METHODS = ["택배", "퀵서비스", "방문수령"] as const;

const buyerFormSchema = z.object({
  buyerName: z.string().trim().min(1, "이름을 입력해주세요").max(50),
  buyerPhone: z.string().trim().min(9, "연락처를 확인해주세요").max(20),
});

type BuyerFormValues = z.infer<typeof buyerFormSchema>;

/** 옵션 체크박스 + 수량 + 실시간 합계. 상세페이지에 바로 보여줄 때, 또는 다이얼로그 안에서 쓰입니다. */
export function OrderOptionsPicker({
  product,
  optionNames,
  onOptionNamesChange,
  quantity,
  onQuantityChange,
}: {
  product: Product;
  optionNames: string[];
  onOptionNamesChange: (names: string[]) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}) {
  const optionsTotal = product.options
    .filter((o) => optionNames.includes(o.name))
    .reduce((sum, o) => sum + o.extra_price, 0);
  const total = (product.price + optionsTotal) * quantity;

  return (
    <div className="space-y-4">
      {product.options.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium">추가 옵션</p>
          <div className="space-y-2 border border-hairline p-3">
            {product.options.map((o) => (
              <label
                key={o.name}
                className="flex cursor-pointer items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2">
                  <Checkbox
                    checked={optionNames.includes(o.name)}
                    onCheckedChange={(checked) =>
                      onOptionNamesChange(
                        checked
                          ? [...optionNames, o.name]
                          : optionNames.filter((n) => n !== o.name),
                      )
                    }
                  />
                  {o.name}
                </span>
                {o.extra_price ? (
                  <span className="text-muted-foreground">+{o.extra_price.toLocaleString()}원</span>
                ) : null}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">수량</span>
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value) || 1))}
          className="w-24"
        />
      </div>

      <div className="hairline-t flex items-center justify-between pt-3 text-sm">
        <span className="text-muted-foreground">{product.shipping_note ?? "배송비 안내 없음"}</span>
        <span className="font-bold">총 금액 ₩{total.toLocaleString()}</span>
      </div>
    </div>
  );
}

export function OrderDialog({
  product,
  trigger,
  optionNames,
  quantity,
}: {
  product: Product;
  trigger: React.ReactNode;
  /** 넘기지 않으면 다이얼로그 안에서 옵션/수량을 자체적으로 물어봅니다 (카드 등 컴팩트한 곳에서 사용). */
  optionNames?: string[];
  quantity?: number;
}) {
  const [open, setOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{
    quantity: number;
    total: number;
    optionNames: string[];
  } | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<string>(DELIVERY_METHODS[0]);

  const isControlled = optionNames !== undefined && quantity !== undefined;
  const [internalOptionNames, setInternalOptionNames] = useState<string[]>([]);
  const [internalQuantity, setInternalQuantity] = useState(1);

  const effectiveOptionNames = isControlled ? optionNames : internalOptionNames;
  const effectiveQuantity = isControlled ? quantity : internalQuantity;

  const form = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerFormSchema),
    defaultValues: { buyerName: "", buyerPhone: "" },
  });

  function unitPrice() {
    const optionsTotal = product.options
      .filter((o) => effectiveOptionNames.includes(o.name))
      .reduce((sum, o) => sum + o.extra_price, 0);
    return product.price + optionsTotal;
  }

  async function onSubmit(values: BuyerFormValues) {
    const finalUnitPrice = unitPrice();
    const optionLabel = effectiveOptionNames.join(", ") || null;

    try {
      const { error } = await supabase.from("orders").insert({
        product_id: product.id,
        product_name: product.name,
        unit_price: finalUnitPrice,
        quantity: effectiveQuantity,
        option_name: optionLabel,
        delivery_method: deliveryMethod,
        buyer_name: values.buyerName,
        buyer_phone: values.buyerPhone,
      });
      if (error) throw error;

      await notifyNewOrder({
        data: {
          productName: product.name,
          optionName: optionLabel ?? undefined,
          deliveryMethod,
          quantity: effectiveQuantity,
          unitPrice: finalUnitPrice,
          buyerName: values.buyerName,
          buyerPhone: values.buyerPhone,
        },
      });

      setPlacedOrder({
        quantity: effectiveQuantity,
        total: finalUnitPrice * effectiveQuantity,
        optionNames: effectiveOptionNames,
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
      setInternalOptionNames([]);
      setInternalQuantity(1);
      setDeliveryMethod(DELIVERY_METHODS[0]);
    }
  }

  function copyAccountNumber() {
    navigator.clipboard.writeText(BANK_INFO.accountNumber);
    toast.success("계좌번호가 복사되었습니다");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
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
                <span className="text-muted-foreground">배송방법</span>
                <span className="font-medium">{deliveryMethod}</span>
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
                {!isControlled ? (
                  <OrderOptionsPicker
                    product={product}
                    optionNames={internalOptionNames}
                    onOptionNamesChange={setInternalOptionNames}
                    quantity={internalQuantity}
                    onQuantityChange={setInternalQuantity}
                  />
                ) : null}

                <div>
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

                {isControlled ? (
                  <div className="hairline-t pt-3 text-right text-sm font-bold">
                    총 금액 ₩{(unitPrice() * effectiveQuantity).toLocaleString()}
                  </div>
                ) : null}

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
