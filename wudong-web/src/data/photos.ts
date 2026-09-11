/**
 * 本地实景图索引池（统一入口，组件从这里取图，禁止直接写 assets 路径）。
 * 来源与协议见 CREDITS.md；标注「网络抓取」的素材仅作个人学习用途。
 */
import post1 from '../assets/img/post/post-1.jpg'
import post4 from '../assets/img/post/post-4.jpg'
import post6 from '../assets/img/post/post-6.jpg'
import routeWudong from '../assets/img/route/route-wudong.jpg'
import routeLeigong from '../assets/img/route/route-leigong.jpg'
import routeXijiang from '../assets/img/route/route-xijiang.jpg'
import scenicTerrace from '../assets/img/scenic/scenic-terrace.jpg'
import scenicCloud from '../assets/img/scenic/scenic-cloud.jpg'
import scenicFalls from '../assets/img/scenic/scenic-falls.jpg'
import foodSourfish from '../assets/img/food/food-sourfish.jpg'
import foodCiba from '../assets/img/food/food-ciba.jpg'
import productSilver from '../assets/img/product/product-silver.jpg'
import productBatik from '../assets/img/product/product-batik.jpg'
import productEmbroidery from '../assets/img/product/product-embroidery.jpg'
import productBrocade from '../assets/img/product/product-brocade.jpg'
import hotelH1 from '../assets/img/hotel/h1.jpg'

/** 游记 images: number[] 索引池（src/data/mock.ts 中 posts 引用）：
 *  0 梯田村落 / 1 酸汤鱼(长桌宴) / 2 蜡染 / 3 雨后吊脚楼 / 4 苗绣 / 5 徒步山景 */
export const POST_PHOTOS: string[] = [post1, foodSourfish, productBatik, routeWudong, productEmbroidery, scenicCloud]
export const postPhoto = (i?: number): string | undefined => (i == null ? undefined : POST_PHOTOS[i])

/** 路线封面（按 routeId） */
export const ROUTE_COVERS: Record<number, string> = { 1: routeWudong, 2: routeLeigong }

/** 景点封面（按 spotId：1 梯田 / 2 银饰工坊 / 3 长桌宴 / 4 吊脚楼民宿 / 5 蜡染坊 / 6 芦笙广场） */
export const SCENIC_COVERS: Record<number, string> = {
  1: scenicTerrace, 2: productSilver, 3: foodSourfish, 4: hotelH1, 5: productBatik, 6: post6,
}

/** 首页「真实足迹」精选封面 */
export const HL_COVERS: string[] = [post1, post4, post6]

/** 非遗商品封面（按商品 id：1 银饰 / 2 蜡染；3 竹编暂无题材匹配→视图层纹样占位） */
export const PRODUCT_COVERS: Record<number, string> = { 1: productSilver, 2: productBatik }

/** 农产品封面（按商品 id；茶/蜂蜜暂无题材匹配→纹样占位，补图走 scripts/probe-images.mjs） */
export const FARM_COVERS: Record<number, string> = {}

/** 餐厅封面（按餐厅 id：长桌宴用酸汤鱼实景） */
export const RESTAURANT_COVERS: Record<number, string> = { 3: foodSourfish }

/** 备用导出（后续列表/详情页接入用） */
export const EXTRA_COVERS = { routeXijiang, scenicFalls, foodCiba, productBrocade }
