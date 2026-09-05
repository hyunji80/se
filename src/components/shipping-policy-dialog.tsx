import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const POLICIES = [
  {
    title: "오배송",
    desc: "확인 즉시 무상으로 회수해 드리며, 정상 상품으로 다시 보내드립니다.",
  },
  {
    title: "상품 불량",
    desc: "상품을 받으신 당일, 불량 부위 사진과 함께 접수해주시면 무상으로 회수 후 확인을 거쳐 환불해드립니다.",
  },
  {
    title: "배송비",
    desc: "상품마다 배송비 정책이 다를 수 있어, 각 상품 상세페이지에 안내된 배송비 안내문구를 따릅니다.",
  },
];

export function ShippingPolicyDialog({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">배송 · 반품 규정안내</DialogTitle>
          <DialogDescription>오배송·불량·배송비에 대한 안내입니다.</DialogDescription>
        </DialogHeader>
        <ol className="space-y-4">
          {POLICIES.map((p, i) => (
            <li key={p.title} className="flex gap-3">
              <span className="mt-0.5 shrink-0 text-sm font-bold text-accent">{i + 1}</span>
              <div>
                <p className="text-sm font-bold">{p.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
