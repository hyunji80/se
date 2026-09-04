import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";

import { supabase, type Product } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  return session ? <ProductManager /> : <LoginForm />;
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
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">상품 관리</h1>
        <div className="flex items-center gap-2">
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 size-4" />
            상품 추가
          </Button>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            <LogOut className="mr-1.5 size-4" />
            로그아웃
          </Button>
        </div>
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
  const [form, setForm] = useState({
    category: DEFAULT_CATEGORY,
    name: "",
    price: "",
    original_price: "",
    unit: "개",
    image_url: "",
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
        tag: "",
        is_best: false,
      });
    }
  }, [product, open]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        category: form.category,
        name: form.name,
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        unit: form.unit,
        image_url: form.image_url || null,
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
      <DialogContent>
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
            <Label>이미지 URL (선택)</Label>
            <Input
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
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
