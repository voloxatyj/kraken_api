import { Controller, Get, Param } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}
  @Get(':params')
  async getCurrency(@Param('params') params: string) {
    return this.currencyService.getCurrency(params);
  }
}
