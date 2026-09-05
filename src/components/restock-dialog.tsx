import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { supabase, type Product } from "@/lib/supabase";
import { notifyRestockRequest } from "@/lib/order-notify";
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

const restockFormSchema = z.object({
  phone: z.string().trim().min(9, "연락처를 확인해주세요").max(20),
});
type RestockFormValues = z.infer<typeof restockFormSchema>;

export function RestockDialog({ product, trigger }: { product: Product; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  const form = useForm<RestockFormValues>({
    resolver: zodResolver(restockFormSchema),
    defaultValues: { phone: "" },
  });

  async function onSubmit(values: RestockFormValues) {
    try {
      const { error } = await supabase.from("restock_requests").insert({
        product_id: product.id,
        product_name: product.name,
        phone: values.phone,
      });
      if (error) throw error;

      await notifyRestockRequest({ data: { productName: product.name, phone: values.phone } });

      setDone(true);
    } catch (error) {
      console.error(error);
      toast.error("신청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      form.reset();
      setDone(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        {done ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">신청 완료</DialogTitle>
              <DialogDescription>
                재입고되면 입력하신 연락처로 안내드리겠습니다.
              </DialogDescription>
            </DialogHeader>
            <Button className="w-full" onClick={() => handleOpenChange(false)}>
              확인
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">재입고 알림 신청</DialogTitle>
              <DialogDescription>{product.name} · 재입고 시 연락드릴게요.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
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
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "처리 중..." : "신청하기"}
                </Button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
