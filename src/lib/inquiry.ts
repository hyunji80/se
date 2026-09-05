import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { sendKakaoMemo } from "@/lib/kakao";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요").max(50),
  phone: z.string().trim().min(9, "연락처를 확인해주세요").max(20),
  company: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1, "문의 내용을 입력해주세요").max(1000),
});

export const submitInquiry = createServerFn({ method: "POST" })
  .validator(inquirySchema)
  .handler(async ({ data }) => {
    const text = [
      "📩 SE 종합물산 새 견적 문의",
      `이름: ${data.name}`,
      `연락처: ${data.phone}`,
      data.company ? `회사명: ${data.company}` : null,
      `내용: ${data.message}`,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");

    // 알림 발송 실패가 문의 접수 자체를 막지 않도록 별도로 처리한다.
    try {
      await sendKakaoMemo(text);
    } catch (error) {
      console.error("Kakao notify failed", error);
    }

    return { ok: true as const };
  });
