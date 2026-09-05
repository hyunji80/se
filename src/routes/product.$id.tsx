import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { supabase, type Product } from "@/lib/supabase";
import { OrderDialog, OrderOptionsPicker } from "@/components/order-dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetailPage,
});

function ProductGallery({ product }: { product: Product }) {
  const images = [product.image_url, ...product.image_urls].filter(
    (u): u is string => !!u,
  );
  const [index, setIndex] = useState(0);
  const current = images[index];

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-paper text-sm text-muted-foreground">
        이미지 준비중
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden bg-paper">
        <img src={current} alt={product.name} className="h-full w-full object-cover" />
        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="이전 이미지"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center bg-background/80 hover:bg-background"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="다음 이미지"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center bg-background/80 hover:bg-background"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndex(i)}
              className={`size-16 shrink-0 overflow-hidden ${
                i === index ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100"
              }`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DetailHtmlFrame({ html }: { html: string }) {
  const [height, setHeight] = useState(600);
  const ref = useRef<HTMLIFrameElement>(null);

  return (
    <iframe
      ref={ref}
      srcDoc={html}
      title="상품 상세페이지"
      style={{ height }}
      className="w-full border-0"
      onLoad={() => {
        const doc = ref.current?.contentWindow?.document;
        if (doc) setHeight(doc.documentElement.scrollHeight);
      }}
    />
  );
}

function ProductDetailPage() {
  const { id } = Route.useParams();
  const [optionNames, setOptionNames] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Product;
    },
  });

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">불러오는 중...</div>;
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">상품을 찾을 수 없습니다.</p>
        <Link to="/shop" className="text-sm font-medium underline">
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  const hasDiscount = product.original_price != null && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="hairline-b sticky top-0 z-50 bg-background/95 px-6 py-5 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-[1000px] items-center gap-2">
          <Link
            to="/shop"
            className="link-underline flex items-center gap-1 text-[13px] font-medium text-foreground/70 hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            전체 상품으로
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1000px] gap-10 px-6 py-14 sm:grid-cols-2 sm:px-8">
        <ProductGallery product={product} />

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-label text-accent">
            {product.category}
          </p>
          <h1 className="font-display mt-3 text-2xl font-bold sm:text-3xl">{product.name}</h1>

          <div className="mt-6">
            {hasDiscount ? (
              <>
                <p className="text-sm text-muted-foreground line-through">
                  ₩{product.original_price!.toLocaleString()}
                </p>
                <p className="mt-1 text-2xl font-bold text-accent">
                  ₩{product.price.toLocaleString()}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    / {product.unit}
                  </span>
                  <span className="ml-2 text-sm font-bold text-accent">{discountPercent}% 할인</span>
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold">
                ₩{product.price.toLocaleString()}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  / {product.unit}
                </span>
              </p>
            )}
          </div>

          <div className="mt-8 border-t border-hairline pt-6">
            <OrderOptionsPicker
              product={product}
              optionNames={optionNames}
              onOptionNamesChange={setOptionNames}
              quantity={quantity}
              onQuantityChange={setQuantity}
            />
          </div>

          <OrderDialog
            product={product}
            optionNames={optionNames}
            quantity={quantity}
            trigger={
              <Button className="mt-6 w-full py-6 text-sm tracking-[0.16em]">주문하기</Button>
            }
          />

          {!product.detail_html && product.description ? (
            <div className="hairline-t mt-10 pt-8">
              <h2 className="font-display text-sm font-bold">상품 설명</h2>
              <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          ) : null}
        </div>
      </main>

      {product.detail_html ? (
        <div className="hairline-t mx-auto max-w-[1000px]">
          <DetailHtmlFrame html={product.detail_html} />
        </div>
      ) : null}
    </div>
  );
}
