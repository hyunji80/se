import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Heart,
  ShoppingBag,
  ArrowRight,
  Plus,
  Truck,
  RotateCcw,
  Building2,
  Zap,
  SprayCan,
  Package,
  Paperclip,
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SE 종합물산 — 필요한 모든 소모품, 한 곳에서" },
      {
        name: "description",
        content:
          "전기자재부터 위생·청소, 사무·포장까지. SE 종합물산이 일상의 모든 소모품을 백화점의 품격으로 큐레이션합니다. 당일 출고 · 대량구매 견적.",
      },
      { property: "og:title", content: "SE 종합물산 — 필요한 모든 소모품, 한 곳에서" },
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

const categories = [
  {
    icon: Zap,
    name: "전기자재",
    desc: "스위치 · 콘센트 · 전선",
    count: "86 품목",
    image: catElectric,
    alt: "화이트 스위치와 콘센트 제품",
  },
  {
    icon: SprayCan,
    name: "위생·청소",
    desc: "장갑 · 세정제 · 소모품",
    count: "142 품목",
    image: catHygiene,
    alt: "위생 장갑과 세정 스프레이",
  },
  {
    icon: Package,
    name: "사무·포장",
    desc: "박스 · 테이프 · 사무용품",
    count: "98 품목",
    image: catOffice,
    alt: "크라프트 박스와 포장 테이프",
  },
  {
    icon: Paperclip,
    name: "생활소모품",
    desc: "종이제품 · 생활 부자재",
    count: "76 품목",
    image: catDaily,
    alt: "페이퍼 타월 롤",
  },
];

const bestSellers = [
  { image: pOutlet, alt: "화이트 1구 콘센트", category: "전기자재", name: "1구 콘센트 A형 화이트", price: "2,400", unit: "개" },
  { image: pGloves, alt: "니트릴 위생 장갑", category: "위생·청소", name: "니트릴 위생 장갑 M 100매", price: "3,100", unit: "박스" },
  { image: pTape, alt: "투명 양면 테이프", category: "사무·포장", name: "양면 폼 테이프 15mm", price: "1,800", unit: "롤" },
  { image: pTowel, alt: "키친 타월 롤", category: "생활소모품", name: "무형광 키친타월 10롤", price: "4,500", unit: "세트" },
];

const services = [
  { icon: Truck, title: "당일 출고", desc: "오후 2시 이전 주문 시 당일 발송됩니다." },
  { icon: RotateCcw, title: "무상 반품", desc: "불량·오배송 시 왕복 운임을 부담하지 않습니다." },
  { icon: Building2, title: "기업 대량구매", desc: "견적서와 세금계산서를 즉시 발급해 드립니다." },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
      {children}
    </p>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 레이어 — 따뜻한 아이보리 위 은은한 광원 */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-cream via-background to-cream-deep">
        <div className="absolute -left-32 -top-32 size-[560px] rounded-full bg-gold-soft/60 blur-[140px]" />
        <div className="absolute right-[-140px] top-40 size-[460px] rounded-full bg-gold-soft/50 blur-[130px]" />
        <div className="absolute bottom-[-180px] left-1/3 size-[480px] rounded-full bg-cream-deep/70 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="mx-auto max-w-7xl px-6 pt-6">
        <nav className="glass-card flex items-center justify-between rounded-2xl px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-foreground/20">
              <span className="font-display text-lg font-black">S</span>
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-bold tracking-tight">
                SE 종합물산
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Everyday Commodities
              </p>
            </div>
          </a>
          <ul className="hidden items-center gap-8 text-sm font-medium text-foreground/70 lg:flex">
            {["전체", "전기자재", "위생·청소", "사무·포장", "생활소모품"].map((item, i) => (
              <li key={item}>
                <a
                  href="#categories"
                  className={`transition-colors hover:text-foreground ${i === 0 ? "text-foreground" : ""}`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <button
              aria-label="검색"
              className="glass-card grid size-10 place-items-center rounded-xl text-foreground/70 transition-colors hover:text-foreground"
            >
              <Search className="size-4" strokeWidth={1.5} />
            </button>
            <button
              aria-label="찜 목록"
              className="glass-card hidden size-10 place-items-center rounded-xl text-foreground/70 transition-colors hover:text-foreground sm:grid"
            >
              <Heart className="size-4" strokeWidth={1.5} />
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-foreground/20 transition-colors hover:bg-foreground/85">
              <ShoppingBag className="size-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">
                장바구니{" "}
                <span className="rounded-md bg-primary-foreground/15 px-1.5 text-xs">12</span>
              </span>
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6">
        {/* Hero */}
        <section className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="glass-card relative overflow-hidden rounded-[2rem] p-8 lg:col-span-7 lg:p-14">
            <div className="pointer-events-none absolute -right-10 -top-10 size-56 rounded-full bg-gold-soft/70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 size-56 rounded-full bg-cream-deep/80 blur-3xl" />
            <span className="relative inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent">
              <span className="size-1.5 rounded-full bg-accent" />
              신규 입고 · 2026
            </span>
            <h1 className="font-display relative mt-7 text-4xl font-black leading-[1.18] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              매일의 필요를
              <br />
              정돈하는 <span className="text-accent">상점</span>
            </h1>
            <p className="relative mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              스위치와 콘센트부터 위생 장갑, 청소·사무·포장 용품까지.
              일상의 모든 소모품을 한 곳에서 고르는, 정갈한 종합물산의 경험.
            </p>
            <div className="relative mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#best"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-foreground/20 transition-colors hover:bg-foreground/85"
              >
                지금 둘러보기
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </a>
              <a
                href="#categories"
                className="rounded-xl border border-border bg-card/60 px-7 py-3.5 text-sm font-semibold text-foreground/80 backdrop-blur-xl transition-colors hover:border-foreground/30"
              >
                카테고리 보기
              </a>
            </div>
            <div className="relative mt-10 flex gap-10 border-t border-border pt-7">
              <div>
                <p className="font-display text-2xl font-bold text-accent">2,400+</p>
                <p className="mt-1 text-xs text-muted-foreground">동시 재고 품목</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-accent">8</p>
                <p className="mt-1 text-xs text-muted-foreground">전문 카테고리</p>
              </div>
              <div className="hidden sm:block">
                <p className="font-display text-2xl font-bold text-accent">24h</p>
                <p className="mt-1 text-xs text-muted-foreground">이내 출고</p>
              </div>
            </div>
          </div>

          <div className="glass-card image-zoom relative overflow-hidden rounded-[2rem] lg:col-span-5">
            <img
              src={heroImage}
              alt="아이보리 스톤 위에 놓인 화이트 스위치와 위생 장갑, 페이퍼 롤"
              width={1080}
              height={1280}
              className="h-full min-h-[420px] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-2xl border border-card/70 bg-card/70 p-5 backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                오늘의 큐레이션
              </p>
              <p className="font-display mt-1.5 text-lg font-bold leading-snug">
                위생 장갑이 잘 나가네요
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                비닐 위생 장갑 100매 · 2+1 프로모션 진행 중
              </p>
            </div>
          </div>
        </section>

        {/* 카테고리 */}
        <section id="categories" className="mt-20">
          <div className="mb-8 flex items-end justify-between border-b border-border pb-6">
            <div>
              <Eyebrow>Departments</Eyebrow>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                카테고리별 쇼핑
              </h2>
            </div>
            <a
              href="#"
              className="hidden items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-foreground sm:inline-flex"
            >
              전체 보기
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href="#"
                className="glass-card card-hover image-zoom group block rounded-3xl p-5"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent">
                  <cat.icon className="size-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-display mt-4 text-lg font-bold">{cat.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cat.desc}</p>
                <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-2xl">
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    loading="lazy"
                    width={640}
                    height={512}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  {cat.count}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* 베스트 */}
        <section id="best" className="mt-20">
          <div className="mb-8 flex items-end justify-between border-b border-border pb-6">
            <div>
              <Eyebrow>This Week</Eyebrow>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                이번 주 베스트
              </h2>
            </div>
            <a
              href="#"
              className="hidden items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-foreground sm:inline-flex"
            >
              베스트 전체
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {bestSellers.map((item) => (
              <article
                key={item.name}
                className="glass-card card-hover image-zoom rounded-3xl p-4"
              >
                <div className="aspect-square w-full overflow-hidden rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{item.category}</p>
                <h3 className="font-display mt-0.5 text-sm font-bold leading-snug">
                  {item.name}
                </h3>
                <div className="mt-2.5 flex items-center justify-between">
                  <p className="text-sm font-bold">
                    ₩{item.price}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      / {item.unit}
                    </span>
                  </p>
                  <button
                    aria-label={`${item.name} 장바구니 담기`}
                    className="grid size-8 place-items-center rounded-full bg-accent/10 text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Plus className="size-4" strokeWidth={1.5} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 서비스 + 뉴스레터 */}
        <section className="mt-20 grid gap-6 lg:grid-cols-3">
          <div className="grid gap-6 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="glass-card rounded-3xl p-6">
                <div className="grid size-11 place-items-center rounded-2xl bg-accent/10 text-accent">
                  <s.icon className="size-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-display mt-4 font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="glass-card relative overflow-hidden rounded-3xl p-8">
            <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-gold-soft/70 blur-3xl" />
            <Eyebrow>Newsletter</Eyebrow>
            <h3 className="font-display mt-2 text-2xl font-bold leading-snug">
              새 입고 소식을
              <br />
              가장 먼저
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              주 1회, 할인 쿠폰과 함께 전해드립니다.
            </p>
            <form className="relative mt-6 flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소"
                aria-label="이메일 주소"
                className="w-full rounded-xl border border-border bg-card/80 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-accent/50"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-foreground/20 transition-colors hover:bg-foreground/85"
              >
                구독
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pb-8">
          <div className="glass-card rounded-3xl px-8 py-9">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-lg font-bold">SE 종합물산</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  매일의 필요를 정돈하는 종합 소모품 상점
                </p>
              </div>
              <div className="flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted-foreground">
                <a href="#" className="transition-colors hover:text-foreground">회사소개</a>
                <a href="#" className="transition-colors hover:text-foreground">배송·반품</a>
                <a href="#" className="transition-colors hover:text-foreground">고객센터</a>
                <a href="#" className="transition-colors hover:text-foreground">대량구매 견적</a>
              </div>
            </div>
            <p className="mt-7 border-t border-border pt-5 text-xs text-muted-foreground/80">
              © 2026 SE 종합물산 · 대표 김세영 · 사업자등록번호 123-45-67890 · 서울특별시
              종로구 세종대로 1
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
