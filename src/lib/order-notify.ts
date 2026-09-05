import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { sendKakaoMemo } from "@/lib/kakao";

const orderNotifySchema = z.object({
  productName: z.string().trim().min(1).max(120),
  quantity: z.number().int().min(1),
  unitPrice: z.number().int().min(0),
  buyerName: z.string().trim().min(1, "이름을 입력해주세요").max(50),
  buyerPhone: z.string().trim().min(9, "연락처를 확인해주세요").max(20),
});

export const notifyNewOrder = createServerFn({ method: "POST" })
  .validator(orderNotifySchema)
  .handler(async ({ data }) => {
    const total = data.unitPrice * data.quantity;
    const text = [
      "🛒 SE 종합물산 새 주문 (무통장입금 대기)",
      `상품: ${data.productName}`,
      `수량: ${data.quantity}`,
      `금액: ${total.toLocaleString()}원`,
      `주문자: ${data.buyerName}`,
      `연락처: ${data.buyerPhone}`,
    ].join("\n");

    try {
      await sendKakaoMemo(text);
    } catch (error) {
      console.error("Kakao notify failed", error);
    }

    return { ok: true as const };
  });
