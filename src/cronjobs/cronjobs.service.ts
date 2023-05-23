import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { countAmount, getAllParamsCurrencies } from 'src/utils/helpers';

@Injectable()
export class CronjobsService {
  private logger = new Logger(CronjobsService.name);

  constructor(private prismaService: PrismaService) {}

  @Cron('* 00 00 * * *')
  async handleCron() {
    try {
      const params_currencies = getAllParamsCurrencies();
      const user_s = await this.prismaService.user.findMany({
        select: {
          id: true,
          count: true,
          typeCount: true,
        },
      });
      const currencies = await Promise.allSettled(params_currencies);
      const update_currencies = [];
      user_s.forEach(({ id, count, typeCount }) => {
        const data = countAmount(typeCount, count, currencies, id);
        Reflect.deleteProperty(data, 'userId');
        update_currencies.push(this.prismaService.currency.update({ where: { userId: id }, data }));
      });
      await Promise.allSettled(update_currencies);
      this.logger.log(`Update currencies successfully`);
    } catch (error) {
      this.logger.error(`Failed to update currencies`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
