import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Heart,
  ShoppingBag,
  ArrowRight,
  ArrowUpRight,
  Menu,
  Truck,
  RotateCcw,
  Building2,
} from "lucide-react";

import heroImage from "@/assets/hero-consumables.jpg";
import catElectric from "@/assets/cat-electric.jpg";
import catHygiene from "@/assets/cat-hygiene.jpg";
import catOffice from "@/assets/cat-office.jpg";
import catDaily from "@/assets/cat-daily.jpg";
import pOutlet from "@/assets/p-outlet.jpg";
import pGloves from "@/assets/p-gloves.jpg";
import pTape from "@/assets/p-tape.jpg";
import pTowel from "@/assets/p-towel.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "전체 상품 — SE 종합물산" },
      {
        name: "description",
        content:
          "전기자재부터 위생·청소, 사무·포장까지. SE 종합물산이 일상의 모든 소모품을 백화점의 품격으로 큐레이션합니다. 당일 출고 · 대량구매 견적.",
      },
      { property: "og:title", content: "전체 상품 — SE 종합물산" },
      {
        property: "og:description",
        content:
          "전기자재부터 위생·청소, 사무·포장까지. 일상의 모든 소모품을 백화점의 품격으로.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = ["전체상품", "전기자재", "위생·청소", "사무·포장", "생활소모품", "대량구매"];

const categories = [
  {
    no: "01",
    name: "전기자재",
    desc: "스위치 · 콘센트 · 전선",
    count: "86 품목",
    image: catElectric,
    alt: "화이트 스위치와 콘센트 제품",
  },
  {
    no: "02",
    name: "위생·청소",
    desc: "장갑 · 세정제 · 소모품",
    count: "142 품목",
    image: catHygiene,
    alt: "위생 장갑과 세정 스프레이",
  },
  {
    no: "03",
    name: "사무·포장",
    desc: "박스 · 테이프 · 사무용품",
    count: "98 품목",
    image: catOffice,
    alt: "크라프트 박스와 포장 테이프",
  },
  {
    no: "04",
    name: "생활소모품",
    desc: "종이제품 · 생활 부자재",
    count: "76 품목",
    image: catDaily,
    alt: "페이퍼 타월 롤",
  },
];

const bestSellers = [
  { image: pOutlet, alt: "화이트 1구 콘센트", category: "전기자재", name: "1구 콘센트 A형 화이트", price: "2,400", unit: "개", tag: "BEST" },
  { image: pGloves, alt: "니트릴 위생 장갑", category: "위생·청소", name: "니트릴 위생 장갑 M 100매", price: "3,100", unit: "박스", tag: "2+1" },
  { image: pTape, alt: "투명 양면 테이프", category: "사무·포장", name: "양면 폼 테이프 15mm", price: "1,800", unit: "롤", tag: "" },
  { image: pTowel, alt: "키친 타월 롤", category: "생활소모품", name: "무형광 키친타월 10롤", price: "4,500", unit: "세트", tag: "NEW" },
];

const services = [
  { icon: Truck, title: "당일 출고", desc: "오후 2시 이전 주문 시 당일 발송됩니다." },
  { icon: RotateCcw, title: "무상 반품", desc: "불량·오배송 시 왕복 운임을 부담하지 않습니다." },
  { icon: Building2, title: "기업 대량구매", desc: "견적서와 세금계산서를 즉시 발급해 드립니다." },
];

function SectionHead({
  label,
  title,
  href = "#",
  more = "전체 보기",
}: {
  label: string;
  title: string;
  href?: string;
  more?: string;
}) {
  return (
    <div className="hairline-b flex items-end justify-between pb-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-label text-accent">
          {label}
        </p>
        <h2 className="font-display mt-3 text-2xl font-bold tracking-tight sm:text-[32px]">
          {title}
        </h2>
      </div>
      <a
        href={href}
        className="link-underline hidden items-center gap-1.5 self-end pb-1 text-xs font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
      >
        {more}
        <ArrowRight className="size-3.5" strokeWidth={1.25} />
      </a>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Utility bar */}
      <div className="hairline-b hidden lg:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-end gap-6 px-8 py-2.5 text-[11px] tracking-wide text-muted-foreground">
          <a href="#" className="link-underline hover:text-foreground">로그인</a>
          <a href="#" className="link-underline hover:text-foreground">회원가입</a>
          <a href="#" className="link-underline hover:text-foreground">고객센터</a>
          <a href="#" className="link-underline hover:text-foreground">기업구매</a>
        </div>
      </div>

      {/* Header */}
      <header className="hairline-b sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 sm:px-8">
          <div className="flex items-center gap-10">
            <a href="/" className="leading-none">
              <p className="font-display text-xl font-black tracking-[0.14em]">
                SE <span className="text-accent">·</span> 종합물산
              </p>
              <p className="mt-1.5 text-[9px] font-medium uppercase tracking-label text-muted-foreground">
                Everyday Commodities
              </p>
            </a>
          </div>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-9 text-[13px] font-medium">
              {navItems.map((item, i) => (
                <li key={item}>
                  <a
                    href="#categories"
                    className={`link-underline pb-1 transition-colors hover:text-foreground ${
                      i === 0 ? "text-foreground" : "text-foreground/65"
                    }`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <button aria-label="검색" className="text-foreground/70 transition-colors hover:text-foreground">
              <Search className="size-[18px]" strokeWidth={1.25} />
            </button>
            <button aria-label="찜 목록" className="hidden text-foreground/70 transition-colors hover:text-foreground sm:block">
              <Heart className="size-[18px]" strokeWidth={1.25} />
            </button>
            <button aria-label="장바구니" className="relative text-foreground/70 transition-colors hover:text-foreground">
              <ShoppingBag className="size-[18px]" strokeWidth={1.25} />
              <span className="absolute -right-2 -top-1.5 min-w-4 bg-accent px-1 text-center text-[9px] font-bold leading-4 text-accent-foreground">
                12
              </span>
            </button>
            <button aria-label="메뉴" className="text-foreground/70 lg:hidden">
              <Menu className="size-[18px]" strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — full bleed editorial */}
        <section className="relative">
          <div className="image-zoom relative h-[68vh] min-h-[520px] w-full overflow-hidden">
            <img
              src={heroImage}
              alt="아이보리 스톤 위에 놓인 화이트 스위치와 위생 장갑, 페이퍼 롤"
              width={1920}
              height={1080}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/35" />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="fade-up max-w-3xl text-center text-background">
                <p className="text-[10px] font-semibold uppercase tracking-label">
                  2026 New Arrivals
                </p>
                <h1 className="font-display mt-6 text-3xl font-bold leading-[1.35] tracking-tight sm:text-5xl">
                  매일의 필요를
                  <br />
                  정돈하는 상점
                </h1>
                <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-background/80">
                  스위치와 콘센트부터 위생 장갑, 청소·사무·포장 용품까지.
                  일상의 모든 소모품을 한 곳에서.
                </p>
                <div className="mt-10 flex items-center justify-center gap-4">
                  <a
                    href="#best"
                    className="border border-background/80 px-9 py-3.5 text-xs font-semibold tracking-[0.16em] text-background transition-colors hover:bg-background hover:text-foreground"
                  >
                    ENTER
                  </a>
                  <a
                    href="#categories"
                    className="link-underline pb-0.5 text-xs font-semibold tracking-[0.16em] text-background/90"
                  >
                    카테고리 보기
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Stat strip */}
          <div className="hairline-b">
            <div className="mx-auto grid max-w-[1400px] grid-cols-3 px-6 sm:px-8">
              {[
                { v: "2,400+", l: "동시 재고 품목" },
                { v: "8", l: "전문 카테고리" },
                { v: "24h", l: "이내 출고" },
              ].map((s, i) => (
                <div
                  key={s.l}
                  className={`py-8 text-center ${i > 0 ? "border-l border-hairline" : ""}`}
                >
                  <p className="font-display text-2xl font-bold sm:text-3xl">{s.v}</p>
                  <p className="mt-2 text-[11px] tracking-wide text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 카테고리 */}
        <section id="categories" className="mx-auto max-w-[1400px] px-6 py-20 sm:px-8">
          <SectionHead label="Departments" title="카테고리별 쇼핑" />
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <a key={cat.name} href="#" className="image-zoom group block">
                <div className="aspect-[4/5] w-full overflow-hidden bg-paper">
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    loading="lazy"
                    width={640}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="hairline-b mt-5 flex items-start justify-between pb-4">
                  <div>
                    <p className="text-[10px] font-semibold tracking-label text-accent">
                      {cat.no}
                    </p>
                    <h3 className="font-display mt-2 text-lg font-bold">{cat.name}</h3>
                    <p className="mt-1.5 text-[13px] text-muted-foreground">{cat.desc}</p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 size-4 text-muted-foreground transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground"
                    strokeWidth={1.25}
                  />
                </div>
                <p className="mt-3 text-[11px] tracking-wide text-muted-foreground">
                  {cat.count}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* 베스트 */}
        <section id="best" className="bg-paper">
          <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-8">
            <SectionHead label="This Week" title="이번 주 베스트" more="베스트 전체" />
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
              {bestSellers.map((item) => (
                <article key={item.name} className="image-zoom group">
                  <div className="relative aspect-square w-full overflow-hidden bg-background">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      width={640}
                      height={640}
                      className="h-full w-full object-cover"
                    />
                    {item.tag ? (
                      <span className="absolute left-0 top-0 bg-ink px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-background">
                        {item.tag}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-5 text-[10px] font-semibold tracking-label text-muted-foreground">
                    {item.category}
                  </p>
                  <h3 className="font-display mt-2.5 text-[15px] font-bold leading-snug">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-[15px] font-bold">
                    ₩{item.price}
                    <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
                      / {item.unit}
                    </span>
                  </p>
                  <button className="hairline-t mt-4 w-full py-3 text-[11px] font-semibold tracking-[0.16em] text-foreground/70 transition-colors hover:text-accent">
                    장바구니 담기
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 서비스 */}
        <section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-8">
          <SectionHead label="Services" title="이용 안내" more="자세히 보기" />
          <div className="mt-10 grid sm:grid-cols-3">
            {services.map((s, i) => (
              <div
                key={s.title}
                className={`px-0 py-8 sm:px-10 ${i > 0 ? "border-hairline sm:border-l" : ""} ${
                  i > 0 ? "hairline-t sm:border-t-0" : ""
                }`}
              >
                <s.icon className="size-6 text-accent" strokeWidth={1.1} />
                <h3 className="font-display mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 뉴스레터 */}
        <section className="bg-ink">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-8 px-6 py-20 text-center sm:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-label text-background/60">
              Newsletter
            </p>
            <h2 className="font-display text-2xl font-bold leading-snug text-background sm:text-[32px]">
              새 입고 소식을 가장 먼저
            </h2>
            <p className="text-[13px] text-background/70">
              주 1회, 할인 쿠폰과 함께 전해드립니다.
            </p>
            <form className="flex w-full max-w-md items-center border-b border-background/40 pb-2">
              <input
                type="email"
                placeholder="이메일 주소"
                aria-label="이메일 주소"
                className="w-full bg-transparent px-1 py-2 text-sm text-background outline-none placeholder:text-background/45"
              />
              <button
                type="submit"
                className="shrink-0 px-2 text-[11px] font-semibold tracking-[0.16em] text-background transition-colors hover:text-accent"
              >
                구독
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="mx-auto max-w-[1400px] px-6 py-14 sm:px-8">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div>
              <p className="font-display text-lg font-black tracking-[0.14em]">
                SE <span className="text-accent">·</span> 종합물산
              </p>
              <p className="mt-3 text-[13px] text-muted-foreground">
                매일의 필요를 정돈하는 종합 소모품 상점
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-muted-foreground">
              <a href="#" className="link-underline hover:text-foreground">회사소개</a>
              <a href="#" className="link-underline hover:text-foreground">배송·반품</a>
              <a href="#" className="link-underline hover:text-foreground">고객센터</a>
              <a href="#" className="link-underline hover:text-foreground">대량구매 견적</a>
            </div>
          </div>
          <p className="hairline-t mt-10 pt-6 text-[11px] leading-relaxed text-muted-foreground/80">
            © 2026 SE 종합물산 · 대표 김세영 · 사업자등록번호 123-45-67890 · 서울특별시 종로구 세종대로 1
          </p>
        </footer>
      </main>
    </div>
  );
}
