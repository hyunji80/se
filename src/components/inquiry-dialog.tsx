import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { submitInquiry } from "@/lib/inquiry";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const inquiryFormSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요").max(50),
  phone: z.string().trim().min(9, "연락처를 확인해주세요").max(20),
  company: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1, "문의 내용을 입력해주세요").max(1000),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

export function InquiryDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: { name: "", phone: "", company: "", message: "" },
  });

  async function onSubmit(values: InquiryFormValues) {
    try {
      await submitInquiry({ data: values });
      toast.success("문의가 접수되었습니다. 빠르게 연락드리겠습니다.");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">견적 · 대량구매 문의</DialogTitle>
          <DialogDescription>
            남겨주신 내용을 확인 후 빠르게 연락드립니다.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input placeholder="홍길동" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회사명 (선택)</FormLabel>
                  <FormControl>
                    <Input placeholder="회사명" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>문의 내용</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="필요하신 품목, 수량, 희망 납기 등을 적어주세요."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "전송 중..." : "문의 보내기"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
