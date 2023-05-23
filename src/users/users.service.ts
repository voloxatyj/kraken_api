import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUsers } from 'src/utils/randomUsers';
import { countAmount } from 'src/utils/helpers';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(private configService: ConfigService,
    private prismaService: PrismaService
  ) {}

  async createUsers() {
    const amount_users = this.configService.get('AMOUNT_USERS');
    const counts = [];

    try {
      const { users, currency } = await randomUsers(amount_users);
      const data = users.map(({ name, email, phone, login, count, typeCount }, idx) => {
        counts.push(countAmount(typeCount, count, currency, idx + 1));
        return {
          firtsName: name.first,
          lastName: name.last,
          email,
          phone,
          hash: login.sha256,
          count,
          typeCount,
        };
      }) as User[];
      await this.prismaService.user.createMany({ data });
      await this.prismaService.currency.createMany({ data: counts });
    } catch (error) {
      this.logger.error(`Failed to create users`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
