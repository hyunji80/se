import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";

import { supabase, type Product } from "@/lib/supabase";
import { OrderDialog } from "@/components/order-dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetailPage,
});

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
        <div className="aspect-square w-full overflow-hidden bg-paper">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              이미지 준비중
            </div>
          )}
        </div>

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

          {product.shipping_note ? (
            <p className="mt-3 text-xs text-muted-foreground">배송비: {product.shipping_note}</p>
          ) : null}

          <OrderDialog
            product={product}
            trigger={
              <Button className="mt-8 w-full py-6 text-sm tracking-[0.16em]">주문하기</Button>
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
