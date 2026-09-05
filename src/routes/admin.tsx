import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { Plus, Pencil, Trash2, LogOut, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

import { supabase, type Product, type Order } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const CATEGORIES = ["전기자재", "위생·청소", "사무·포장", "생활소모품"] as const;
const DEFAULT_CATEGORY: string = CATEGORIES[0];
const ORDER_STATUSES = ["입금대기", "입금확인", "발송완료", "취소"] as const;

function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="flex min-h-screen items-center justify-center">불러오는 중...</div>;
  }

  return session ? <AdminDashboard /> : <LoginForm />;
}

function AdminDashboard() {
  const [tab, setTab] = useState<"products" | "orders">("products");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setTab("products")}
            className={`font-display text-2xl font-bold ${tab === "products" ? "" : "text-muted-foreground"}`}
          >
            상품 관리
          </button>
          <button
            type="button"
            onClick={() => setTab("orders")}
            className={`font-display text-2xl font-bold ${tab === "orders" ? "" : "text-muted-foreground"}`}
          >
            주문 관리
          </button>
        </div>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>
          <LogOut className="mr-1.5 size-4" />
          로그아웃
        </Button>
      </div>
      {tab === "products" ? <ProductManager /> : <OrderManager />}
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("로그인 실패: " + error.message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="font-display text-xl font-bold">관리자 로그인</h1>
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </div>
  );
}

function ProductManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Product[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("삭제되었습니다");
    },
    onError: (error: Error) => toast.error("삭제 실패: " + error.message),
  });

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setDialogOpen(true);
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-1.5 size-4" />
          상품 추가
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">불러오는 중...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>카테고리</TableHead>
              <TableHead>상품명</TableHead>
              <TableHead>정가</TableHead>
              <TableHead>판매가</TableHead>
              <TableHead>단위</TableHead>
              <TableHead>베스트</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {product.original_price ? (
                    <span className="text-muted-foreground line-through">
                      ₩{product.original_price.toLocaleString()}
                    </span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>₩{product.price.toLocaleString()}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>{product.is_best ? "O" : "-"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm(`"${product.name}"을(를) 삭제하시겠습니까?`)) {
                        deleteMutation.mutate(product.id);
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {products?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  등록된 상품이 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <ProductDialog open={dialogOpen} onOpenChange={setDialogOpen} product={editing} />
    </div>
  );
}

function OrderManager() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("상태가 변경되었습니다");
    },
    onError: (error: Error) => toast.error("변경 실패: " + error.message),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("삭제되었습니다");
    },
    onError: (error: Error) => toast.error("삭제 실패: " + error.message),
  });

  return (
    <div>
      {isLoading ? (
        <p className="text-muted-foreground">불러오는 중...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>주문일시</TableHead>
              <TableHead>상품</TableHead>
              <TableHead>수량</TableHead>
              <TableHead>금액</TableHead>
              <TableHead>주문자</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{new Date(order.created_at).toLocaleString("ko-KR")}</TableCell>
                <TableCell>{order.product_name}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>₩{(order.unit_price * order.quantity).toLocaleString()}</TableCell>
                <TableCell>{order.buyer_name}</TableCell>
                <TableCell>{order.buyer_phone}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(status) => updateStatusMutation.mutate({ id: order.id, status })}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm(`${order.buyer_name}님의 주문을 삭제하시겠습니까?`)) {
                        deleteOrderMutation.mutate(order.id);
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  접수된 주문이 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function ProductDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    category: DEFAULT_CATEGORY,
    name: "",
    price: "",
    original_price: "",
    unit: "개",
    image_url: "",
    description: "",
    detail_html: "",
    tag: "",
    is_best: false,
  });

  useEffect(() => {
    if (product) {
      setForm({
        category: product.category,
        name: product.name,
        price: String(product.price),
        original_price: product.original_price != null ? String(product.original_price) : "",
        unit: product.unit,
        image_url: product.image_url ?? "",
        description: product.description ?? "",
        detail_html: product.detail_html ?? "",
        tag: product.tag ?? "",
        is_best: product.is_best,
      });
    } else {
      setForm({
        category: DEFAULT_CATEGORY,
        name: "",
        price: "",
        original_price: "",
        unit: "개",
        image_url: "",
        description: "",
        detail_html: "",
        tag: "",
        is_best: false,
      });
    }
  }, [product, open]);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다");
      return;
    }
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
    } catch (error) {
      toast.error("이미지 업로드 실패: " + (error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function handleHtmlFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".html") && !file.name.toLowerCase().endsWith(".htm")) {
      toast.error("HTML 파일만 업로드할 수 있습니다");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, detail_html: String(reader.result) }));
    reader.readAsText(file);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        category: form.category,
        name: form.name,
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        unit: form.unit,
        image_url: form.image_url || null,
        description: form.description || null,
        detail_html: form.detail_html || null,
        tag: form.tag || null,
        is_best: form.is_best,
      };
      const { error } = product
        ? await supabase.from("products").update(payload).eq("id", product.id)
        : await supabase.from("products").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(product ? "수정되었습니다" : "추가되었습니다");
      onOpenChange(false);
    },
    onError: (error: Error) => toast.error("저장 실패: " + error.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "상품 수정" : "상품 추가"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>카테고리</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>상품명</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>판매가 (원)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>단위</Label>
              <Input
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>정가 (할인 전 가격, 선택 — 판매가보다 높을 때만 할인으로 표시됩니다)</Label>
            <Input
              type="number"
              value={form.original_price}
              onChange={(e) => setForm((f) => ({ ...f, original_price: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>상품 이미지 (선택)</Label>
            {form.image_url ? (
              <div className="relative w-fit">
                <img src={form.image_url} alt="" className="h-32 w-32 object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                  className="absolute -right-2 -top-2 rounded-full bg-foreground p-1 text-background"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleFile(file);
                }}
                className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-hairline text-sm text-muted-foreground hover:border-foreground"
              >
                <UploadCloud className="size-5" />
                {uploading ? "업로드 중..." : "클릭하거나 이미지를 끌어다 놓으세요"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </label>
            )}
          </div>
          <div className="space-y-2">
            <Label>상세 설명 (선택 — 짧은 줄글, 아래 커스텀 페이지가 없을 때만 표시됩니다)</Label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>
              커스텀 상세페이지 HTML (선택 — 파일을 끌어다 놓거나, 첨부하거나, 내용을 붙여넣으세요.
              입력 시 위 "상세 설명" 대신 이게 표시됩니다)
            </Label>
            <div className="flex justify-end">
              <label className="cursor-pointer text-xs font-medium text-accent hover:underline">
                파일 선택
                <input
                  type="file"
                  accept=".html,.htm,text/html"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleHtmlFile(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <Textarea
              rows={6}
              placeholder="<!doctype html>...로 시작하는 전체 HTML을 붙여넣거나, HTML 파일을 이 칸에 끌어다 놓으세요"
              value={form.detail_html}
              onChange={(e) => setForm((f) => ({ ...f, detail_html: e.target.value }))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleHtmlFile(file);
              }}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label>태그 (선택, 예: NEW / BEST / 2+1)</Label>
            <Input
              value={form.tag}
              onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_best}
              onChange={(e) => setForm((f) => ({ ...f, is_best: e.target.checked }))}
            />
            베스트 상품으로 노출
          </label>
          <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "저장 중..." : "저장"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
