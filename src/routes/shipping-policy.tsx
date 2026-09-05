import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [{ title: "배송·반품 규정안내 — SE 종합물산" }],
  }),
  component: ShippingPolicyPage,
});

const SECTIONS = [
  {
    title: "배송 안내",
    items: [
      {
        heading: "출고 및 배송 기간",
        body: "결제 확인 후 평균 1~3일 이내 출고되며, 오후 2시 이전 주문 건은 당일 출고를 원칙으로 합니다. 상품 준비 상황 및 택배사 사정에 따라 출고가 다소 지연될 수 있습니다.",
      },
      {
        heading: "도서·산간지역 배송",
        body: "제주도, 울릉도 등 도서지역과 산간지역은 택배사 정책에 따라 추가 배송비가 발생하거나 배송기간이 1~3일 추가로 소요될 수 있습니다. 정확한 추가 비용은 주문 시 고객센터로 문의해주세요.",
      },
      {
        heading: "천재지변 등 불가항력 사유",
        body: "태풍, 폭설, 지진 등 자연재해나 택배사 물류 대란 등 당사가 통제할 수 없는 사유로 배송이 지연될 경우, 홈페이지 공지 또는 개별 안내를 통해 예상 지연 기간을 알려드립니다. 이 경우 배송 지연에 대한 별도 보상은 어려운 점 양해 부탁드립니다.",
      },
      {
        heading: "배송비",
        body: "상품마다 배송비 정책이 다를 수 있어, 각 상품 상세페이지에 안내된 배송비 문구를 따릅니다. 대량구매·기업구매 배송비는 별도 협의 후 안내드립니다.",
      },
    ],
  },
  {
    title: "교환·반품 안내",
    items: [
      {
        heading: "오배송",
        body: "주문하신 상품과 다른 상품이 배송된 경우, 확인 즉시 무상으로 회수해 드리며 정상 상품으로 다시 보내드립니다.",
      },
      {
        heading: "상품 불량",
        body: "상품을 받으신 당일, 불량 부위 사진과 함께 고객센터로 접수해주시면 무상으로 회수 후 확인을 거쳐 환불해드립니다.",
      },
      {
        heading: "단순 변심",
        body: "상품 수령 후 7일 이내, 상품과 포장이 훼손되지 않은 상태에 한해 교환·반품이 가능합니다. 이 경우 왕복 배송비는 구매자 부담입니다.",
      },
      {
        heading: "교환·반품이 제한되는 경우",
        body: "위생장갑·세정제 등 개봉 시 재판매가 어려운 위생용품, 사용 흔적이 있거나 포장이 훼손된 상품, 고객 요청에 따른 주문제작 상품은 단순 변심에 의한 교환·반품이 제한될 수 있습니다.",
      },
      {
        heading: "환불",
        body: "반품 상품 확인 후 3영업일 이내 환불 처리되며, 환불이 실제로 완료되기까지 걸리는 기간은 결제 수단에 따라 다를 수 있습니다.\n· 신용카드·체크카드: 카드사 승인 취소 절차에 따라 처리되며, 카드사 정책에 따라 3~5영업일 정도 소요될 수 있습니다.\n· 무통장입금(계좌이체): 안내해주신 환불 계좌로 3영업일 이내 입금됩니다.",
      },
    ],
  },
];

function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="hairline-b sticky top-0 z-50 bg-background/95 px-6 py-5 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-[800px] items-center gap-2">
          <Link
            to="/shop"
            className="link-underline flex items-center gap-1 text-[13px] font-medium text-foreground/70 hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            돌아가기
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-6 py-14 sm:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-label text-accent">
          Policy
        </p>
        <h1 className="font-display mt-3 text-2xl font-bold sm:text-3xl">
          배송 · 반품 규정안내
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          SE 종합물산의 배송, 교환, 반품 기준을 안내드립니다.
        </p>

        {SECTIONS.map((section) => (
          <section key={section.title} className="hairline-t mt-12 pt-10">
            <h2 className="font-display text-lg font-bold">{section.title}</h2>
            <div className="mt-6 space-y-6">
              {section.items.map((item) => (
                <div key={item.heading}>
                  <p className="text-sm font-bold">{item.heading}</p>
                  <p className="mt-1.5 whitespace-pre-line text-[13px] leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
