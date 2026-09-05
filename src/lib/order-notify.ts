import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { sendKakaoMemo } from "@/lib/kakao";

const orderNotifySchema = z.object({
  productName: z.string().trim().min(1).max(120),
  optionName: z.string().trim().max(120).optional(),
  deliveryMethod: z.string().trim().max(20).optional(),
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
      data.optionName ? `옵션: ${data.optionName}` : null,
      data.deliveryMethod ? `배송방법: ${data.deliveryMethod}` : null,
      `수량: ${data.quantity}`,
      `금액: ${total.toLocaleString()}원`,
      `주문자: ${data.buyerName}`,
      `연락처: ${data.buyerPhone}`,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");

    try {
      await sendKakaoMemo(text);
    } catch (error) {
      console.error("Kakao notify failed", error);
    }

    return { ok: true as const };
  });

const cartOrderNotifySchema = z.object({
  items: z
    .array(
      z.object({
        productName: z.string().trim().min(1).max(120),
        optionName: z.string().trim().max(120).optional(),
        quantity: z.number().int().min(1),
        unitPrice: z.number().int().min(0),
      }),
    )
    .min(1),
  deliveryMethod: z.string().trim().max(20).optional(),
  buyerName: z.string().trim().min(1, "이름을 입력해주세요").max(50),
  buyerPhone: z.string().trim().min(9, "연락처를 확인해주세요").max(20),
});

export const notifyCartOrder = createServerFn({ method: "POST" })
  .validator(cartOrderNotifySchema)
  .handler(async ({ data }) => {
    const grandTotal = data.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const itemLines = data.items.map(
      (i) =>
        `- ${i.productName}${i.optionName ? ` (${i.optionName})` : ""} x${i.quantity} = ${(
          i.unitPrice * i.quantity
        ).toLocaleString()}원`,
    );
    const text = [
      "🛒 SE 종합물산 새 주문 (장바구니, 무통장입금 대기)",
      ...itemLines,
      data.deliveryMethod ? `배송방법: ${data.deliveryMethod}` : null,
      `총 금액: ${grandTotal.toLocaleString()}원`,
      `주문자: ${data.buyerName}`,
      `연락처: ${data.buyerPhone}`,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");

    try {
      await sendKakaoMemo(text);
    } catch (error) {
      console.error("Kakao notify failed", error);
    }

    return { ok: true as const };
  });
