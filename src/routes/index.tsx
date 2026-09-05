import { createFileRoute, Link } from "@tanstack/react-router";

import spaceHero from "@/assets/space-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SE 종합물산 — 공간을 채우는 모든 것" },
      {
        name: "description",
        content:
          "비어 있는 공간을 완성하는 자재와 생활소모품. SE 종합물산이 사무실·매장·집의 하루를 채웁니다. 당일 출고 · 대량구매 견적.",
      },
      { property: "og:title", content: "SE 종합물산 — 공간을 채우는 모든 것" },
      {
        property: "og:description",
        content: "비어 있는 공간을 완성하는 자재와 생활소모품, SE 종합물산.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gate,
});

function Gate() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-ink">
      <img
        src={spaceHero}
        alt="저녁 빛이 스며든 정돈된 실내 공간과 물품이 채워진 선반"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/45" />

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <p className="font-display text-base font-black tracking-[0.24em] text-background">
          SE 종합물산
        </p>
        <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] text-background/70">
          <span className="text-background">KR</span>
          <span>·</span>
          <span>EN</span>
        </div>
      </div>

      {/* Center gate */}
      <div className="fade-up relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-background">
        <p className="text-[10px] font-semibold uppercase tracking-label text-background/70">
          Everyday Commodities
        </p>
        <h1 className="font-display mt-7 text-3xl font-bold leading-[1.45] tracking-tight sm:text-[44px]">
          비어 있는 공간을
          <br />
          채우는 일
        </h1>
        <p className="mt-6 max-w-md text-[13px] leading-relaxed text-background/75">
          사무실, 매장, 작업장 그리고 집.
          <br className="hidden sm:block" />
          하루가 움직이는 데 필요한 모든 것을 준비해 둡니다.
        </p>

        <div className="mt-14 border border-background/50 px-12 py-5">
          <p className="text-[11px] tracking-[0.24em] text-background/80">SE STORE</p>
        </div>

        <Link to="/shop" className="mt-4 inline-flex p-4">
          <span className="link-underline pb-1 text-[12px] font-semibold tracking-[0.3em] text-background">
            ENTER
          </span>
        </Link>
      </div>

      {/* Bottom rule */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-background/20">
        <div className="flex items-center justify-between px-6 py-5 text-[10px] tracking-[0.18em] text-background/60 sm:px-10">
          <span>전기자재 · 위생청소 · 사무포장 · 생활소모품</span>
          <span className="hidden sm:inline">당일 출고 · 대량구매 견적</span>
        </div>
      </div>
    </div>
  );
}
