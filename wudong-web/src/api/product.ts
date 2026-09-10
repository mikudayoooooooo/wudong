// 商品浏览数据层
import { request } from './http';
import type { Product, ProductQuery, ProductDetail } from './types';

const toNum = (v: unknown): number => {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

/** 归一商品：decimal 字段转 number */
const normProduct = (p: Product): Product => ({
  ...p,
  price: toNum(p.price),
  sales: toNum(p.sales),
  rating: toNum(p.rating),
  reviewCount: toNum(p.reviewCount),
});

/** 获取商品分类 */
export const getProductCategories = async (): Promise<any[]> => {
  try {
    return await request<any[]>('/app/product/categories');
  } catch (e) {
    console.error('获取分类失败', e);
    return [];
  }
};

/** 搜索商品：按关键字/分类/排序 */
export const searchProducts = async (q: ProductQuery = {}): Promise<Product[]> => {
  const d = await request<{ list: Product[]; pagination: any }>(
    '/app/product/list',
    { ...q, page: q.page ?? 1, size: q.size ?? 20 }
  );
  return (d.list || []).map(normProduct);
};

/** 商品详情 */
export const productDetail = async (id: number): Promise<ProductDetail> => {
  const d = await request<ProductDetail>('/app/product/detail', { id });
  return {
    ...d,
    price: toNum(d.price),
    stock: toNum(d.stock),
    rating: toNum(d.rating),
    reviewCount: toNum(d.reviewCount),
  };
};

/** 获取商品评价 */
export const getProductReviews = async (id: number, page: number = 1): Promise<any> => {
  return await request<any>('/app/product/:id/reviews', { id, page, size: 10 });
};

/** 收藏商品 */
export const toggleProductFavorite = async (id: number): Promise<any> => {
  return await fetch(`/app/product/${id}/favorite`, { method: 'POST' })
    .then(res => res.json());
};
