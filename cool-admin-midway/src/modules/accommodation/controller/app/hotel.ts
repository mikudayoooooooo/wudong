import { CoolController, BaseController, CoolUrlTag, TagTypes, CoolTag } from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import { AccommodationHotelService } from '../../service/hotel';

/**
 * C 端民宿浏览（匿名）
 */
@CoolUrlTag()
@CoolController()
export class AppAccommodationHotelController extends BaseController {
  @Inject()
  hotelService: AccommodationHotelService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/search', { summary: '民宿搜索' })
  async search(@Query() query) {
    return this.ok(await this.hotelService.search(query));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/detail', { summary: '民宿详情（含房型）' })
  async detail(@Query('id') id: number) {
    return this.ok(await this.hotelService.detail(Number(id)));
  }
}
