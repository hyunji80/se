import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요").max(50),
  phone: z.string().trim().min(9, "연락처를 확인해주세요").max(20),
  company: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1, "문의 내용을 입력해주세요").max(1000),
});

async function getKakaoAccessToken(): Promise<string> {
  const clientId = process.env["KAKAO_REST_API_KEY"];
  const refreshToken = process.env["KAKAO_REFRESH_TOKEN"];
  if (!clientId || !refreshToken) {
    throw new Error(
      "카카오 알림 설정이 없습니다 (KAKAO_REST_API_KEY / KAKAO_REFRESH_TOKEN 환경변수 필요)",
    );
  }

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: refreshToken,
  });
  if (process.env["KAKAO_CLIENT_SECRET"]) {
    params.set("client_secret", process.env["KAKAO_CLIENT_SECRET"]!);
  }

  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: params,
  });
  if (!res.ok) {
    throw new Error(`카카오 토큰 갱신 실패: ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function sendKakaoMemo(text: string): Promise<void> {
  const accessToken = await getKakaoAccessToken();
  const templateObject = {
    object_type: "text",
    text,
    link: {
      web_url: process.env["SITE_URL"] ?? "https://se-jonghapmulsan.co.kr",
      mobile_web_url: process.env["SITE_URL"] ?? "https://se-jonghapmulsan.co.kr",
    },
  };

  const res = await fetch("https://kapi.kakao.com/v2/api/talk/memo/default/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams({ template_object: JSON.stringify(templateObject) }),
  });
  if (!res.ok) {
    throw new Error(`카카오 알림 전송 실패: ${await res.text()}`);
  }
}

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
