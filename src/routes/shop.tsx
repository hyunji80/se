import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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

import { toast } from "sonner";

import { InquiryDialog } from "@/components/inquiry-dialog";
import { OrderDialog } from "@/components/order-dialog";
import { supabase, type Product } from "@/lib/supabase";
import { useCart } from "@/lib/cart-context";

import heroImage from "@/assets/hero-space-shop.jpg";
import catElectric from "@/assets/cat-electric.jpg";
import catHygiene from "@/assets/cat-hygiene.jpg";
import catOffice from "@/assets/cat-office.jpg";
import catDaily from "@/assets/cat-daily.jpg";

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
    image: catElectric,
    alt: "화이트 스위치와 콘센트 제품",
  },
  {
    no: "02",
    name: "위생·청소",
    desc: "장갑 · 세정제 · 소모품",
    image: catHygiene,
    alt: "위생 장갑과 세정 스프레이",
  },
  {
    no: "03",
    name: "사무·포장",
    desc: "박스 · 테이프 · 사무용품",
    image: catOffice,
    alt: "크라프트 박스와 포장 테이프",
  },
  {
    no: "04",
    name: "생활소모품",
    desc: "종이제품 · 생활 부자재",
    image: catDaily,
    alt: "페이퍼 타월 롤",
  },
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
  const { addItem, totalCount: cartCount } = useCart();
  const { data: products } = useQuery({
    queryKey: ["storefront-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Product[];
    },
  });

  const bestSellers = (products ?? []).filter((p) => p.is_best);
  const categoryCounts = new Map<string, number>();
  for (const p of products ?? []) {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Utility bar */}
      <div className="hairline-b hidden bg-paper lg:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-end gap-8 px-8 py-3 text-[10px] tracking-[0.14em] text-muted-foreground">
          <a href="#" className="link-underline hover:text-foreground">로그인</a>
          <a href="#" className="link-underline hover:text-foreground">회원가입</a>
          <InquiryDialog
            trigger={
              <button type="button" className="link-underline hover:text-foreground">
                고객센터
              </button>
            }
          />
          <InquiryDialog
            trigger={
              <button type="button" className="link-underline hover:text-foreground">
                기업구매
              </button>
            }
          />
        </div>
      </div>

      {/* Header */}
      <header className="hairline-b sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-7 sm:px-8">
          <div className="flex items-center gap-10">
            <a href="/" className="leading-none">
              <p className="font-display text-2xl font-bold tracking-[0.16em]">
                SE <span className="text-accent">·</span> 종합물산
              </p>
              <p className="mt-2 text-[9px] font-medium uppercase tracking-label text-muted-foreground">
                Everyday Commodities
              </p>
            </a>
          </div>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-11 text-[12px] font-medium tracking-[0.04em]">
              {navItems.map((item, i) => (
                <li key={item}>
                  <a
                    href="#categories"
                    className={`link-underline pb-1 transition-colors hover:text-foreground ${
                      i === 0 ? "text-foreground" : "text-foreground/60"
                    }`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-6">
            <button aria-label="검색" className="text-foreground/70 transition-colors hover:text-foreground">
              <Search className="size-[17px]" strokeWidth={1} />
            </button>
            <button aria-label="찜 목록" className="hidden text-foreground/70 transition-colors hover:text-foreground sm:block">
              <Heart className="size-[17px]" strokeWidth={1} />
            </button>
            <Link
              to="/cart"
              aria-label="장바구니"
              className="relative text-foreground/70 transition-colors hover:text-foreground"
            >
              <ShoppingBag className="size-[17px]" strokeWidth={1} />
              {cartCount > 0 ? (
                <span className="absolute -right-2.5 -top-2 min-w-4 border border-accent px-1 text-center text-[9px] font-medium leading-4 text-accent">
                  {cartCount}
                </span>
              ) : null}
            </Link>
            <button aria-label="메뉴" className="text-foreground/70 lg:hidden">
              <Menu className="size-[17px]" strokeWidth={1} />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — full bleed editorial */}
        <section className="relative">
          <div className="image-zoom relative h-[78vh] min-h-[600px] w-full overflow-hidden">
            <img
              src={heroImage}
              alt="따뜻한 조명 아래 정돈되어 채워진 어두운 실내 공간의 선반"
              width={1920}
              height={1080}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/55" />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="fade-up max-w-3xl text-center text-background">
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-background/70">
                  The Filled Space
                </p>
                <h1 className="font-display mt-8 text-4xl font-bold leading-[1.4] tracking-tight sm:text-6xl">
                  공간을 채우는
                  <br />
                  모든 것
                </h1>
                <p className="mx-auto mt-8 max-w-lg text-[13px] leading-loose text-background/80">
                  스위치와 콘센트부터 위생 장갑, 청소·사무·포장 용품까지.
                  비어 있는 자리를 채우는 일상의 모든 소모품.
                </p>
                <div className="mt-12 flex items-center justify-center gap-5">
                  <a
                    href="#best"
                    className="border border-background/80 px-10 py-4 text-[11px] font-semibold tracking-[0.24em] text-background transition-colors hover:bg-background hover:text-foreground"
                  >베스트 상품 보기</a>
                  <a
                    href="#categories"
                    className="link-underline pb-0.5 text-[11px] font-semibold tracking-[0.24em] text-background/90"
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
                  className={`py-10 text-center ${i > 0 ? "border-l border-hairline" : ""}`}
                >
                  <p className="font-display text-3xl font-bold sm:text-[32px]">{s.v}</p>
                  <p className="mt-2.5 text-[10px] tracking-[0.18em] text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 카테고리 */}
        <section id="categories" className="mx-auto max-w-[1400px] px-6 py-28 sm:px-8">
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
                  {categoryCounts.get(cat.name) ?? 0} 품목
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* 베스트 */}
        <section id="best" className="bg-paper">
          <div className="mx-auto max-w-[1400px] px-6 py-28 sm:px-8">
            <SectionHead label="This Week" title="이번 주 베스트" more="베스트 전체" />
            {bestSellers.length === 0 ? (
              <p className="mt-10 text-sm text-muted-foreground">
                등록된 베스트 상품이 없습니다.
              </p>
            ) : (
              <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
                {bestSellers.map((item) => {
                  const hasDiscount =
                    item.original_price != null && item.original_price > item.price;
                  const discountPercent = hasDiscount
                    ? Math.round((1 - item.price / item.original_price!) * 100)
                    : 0;

                  return (
                    <article key={item.id} className="image-zoom group">
                      <Link to="/product/$id" params={{ id: item.id }}>
                        <div className="relative aspect-square w-full overflow-hidden bg-paper">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              loading="lazy"
                              className={`h-full w-full object-cover ${
                                item.is_sold_out ? "grayscale" : ""
                              }`}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                              이미지 준비중
                            </div>
                          )}
                          {item.is_sold_out ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
                              <span className="border border-background px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-background">
                                품절
                              </span>
                            </div>
                          ) : null}
                          {item.tag ? (
                            <span className="absolute left-0 top-0 bg-ink px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-background">
                              {item.tag}
                            </span>
                          ) : null}
                          {hasDiscount ? (
                            <span className="absolute right-0 top-0 bg-accent px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-accent-foreground">
                              {discountPercent}%
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-5 text-[10px] font-semibold tracking-label text-muted-foreground">
                          {item.category}
                        </p>
                        <h3 className="font-display mt-2.5 text-[15px] font-bold leading-snug hover:text-accent">
                          {item.name}
                        </h3>
                      </Link>
                      {hasDiscount ? (
                        <p className="mt-3 text-[12px] text-muted-foreground line-through">
                          ₩{item.original_price!.toLocaleString()}
                        </p>
                      ) : null}
                      <p className={hasDiscount ? "text-[15px] font-bold text-accent" : "mt-3 text-[15px] font-bold"}>
                        ₩{item.price.toLocaleString()}
                        <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
                          / {item.unit}
                        </span>
                      </p>
                      {item.is_sold_out ? (
                        <button
                          disabled
                          className="hairline-t mt-4 w-full py-3 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground"
                        >
                          품절된 상품입니다
                        </button>
                      ) : (
                        <div className="hairline-t mt-4 grid grid-cols-2">
                          <button
                            onClick={() => {
                              addItem({
                                productId: item.id,
                                productName: item.name,
                                unitPrice: item.price,
                                quantity: 1,
                                optionNames: [],
                                imageUrl: item.image_url,
                                unit: item.unit,
                              });
                              toast.success("장바구니에 담았습니다");
                            }}
                            className="border-r border-hairline py-3 text-[11px] font-semibold tracking-[0.12em] text-foreground/70 transition-colors hover:text-accent"
                          >
                            장바구니
                          </button>
                          <OrderDialog
                            product={item}
                            trigger={
                              <button className="w-full py-3 text-[11px] font-semibold tracking-[0.12em] text-foreground/70 transition-colors hover:text-[#C98A92]">
                                주문하기
                              </button>
                            }
                          />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 서비스 */}
        <section className="mx-auto max-w-[1400px] px-6 py-28 sm:px-8">
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
                {s.title === "기업 대량구매" ? (
                  <InquiryDialog
                    trigger={
                      <button
                        type="button"
                        className="link-underline mt-4 text-[11px] font-semibold tracking-[0.16em] text-accent"
                      >
                        문의하기
                      </button>
                    }
                  />
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* 뉴스레터 */}
        <section className="bg-ink">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-8 px-6 py-28 text-center sm:px-8">
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
              <InquiryDialog
                trigger={
                  <button type="button" className="link-underline hover:text-foreground">
                    고객센터
                  </button>
                }
              />
              <InquiryDialog
                trigger={
                  <button type="button" className="link-underline hover:text-foreground">
                    대량구매 견적
                  </button>
                }
              />
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
