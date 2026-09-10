import { Get, Inject, Query } from '@midwayjs/core';
import { CoolController, BaseController, CoolUrlTag, CoolTag, TagTypes } from '@cool-midway/core';
import { RestaurantService } from '../../service/restaurant';

/**
 * 餐厅C端控制器
 */
@CoolUrlTag()
@CoolController('/app/food/restaurant')
export class AppRestaurantController extends BaseController {
  @Inject()
  restaurantService: RestaurantService;

  /**
   * 餐厅列表
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '餐厅列表' })
  async list(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('keyword') keyword?: string,
    @Query('longitude') longitude?: number,
    @Query('latitude') latitude?: number,
    @Query('sort') sort?: string
  ) {
    const result = await this.restaurantService.getPublicList({
      page,
      size,
      keyword,
      longitude,
      latitude,
      sort,
    });
    return this.ok(result);
  }

  /**
   * 餐厅详情
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/detail', { summary: '餐厅详情' })
  async getDetail(@Query('id') id: number) {
    const restaurant = await this.restaurantService.getDetail(id);
    if (!restaurant) {
      return this.fail('餐厅不存在');
    }
    return this.ok(restaurant);
  }

  /**
   * 获取餐厅菜品
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/:id/dishes', { summary: '餐厅菜品列表' })
  async getDishes(@Query('id') id: number) {
    const dishes = await this.restaurantService.getRestaurantDishes(id);
    return this.ok(dishes);
  }

  /**
   * 获取可预订时段
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/:id/time-slots', { summary: '可预订时段' })
  async getTimeSlots(
    @Query('id') id: number,
    @Query('date') date: string
  ) {
    const slots = await this.restaurantService.getAvailableTimeSlots(id, date);
    return this.ok(slots);
  }
}
