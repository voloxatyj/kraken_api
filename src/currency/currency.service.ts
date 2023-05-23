import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { getCurrencyAPI } from 'src/utils/helpers';

@Injectable()
export class CurrencyService {
  private logger = new Logger(CurrencyService.name);

  async getCurrency(params: string) {
    try {
      const { result } = await getCurrencyAPI(params);
      const data = {
        type: params.toUpperCase(),
      };

      for (const key in result) {
        data[key.slice(-3)] = result[key].o;
      }

      this.logger.log('Get currency successfully');
      return data;
    } catch (error) {
      this.logger.error(`Failed to get currency`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
