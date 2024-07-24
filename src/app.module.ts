import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './database/helper/cron.service';
import { PaginationHelper } from './database/helper/pagination.service';
import { User } from './database/users/entities/user.entity';
import { UsersController } from './database/users/users.controller';
import { UsersService } from './database/users/users.service';
import { StatsService } from './database/statstic/stats.service';
import { StatsController } from './database/statstic/stats.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './database/auth/auth.controller';
import { AuthService } from './database/auth/auth.service';
import { JwtStrategy } from './database/auth/jwt.strategy';
import { DatabaseModule } from './database.module';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    ConfigModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AuthController, UsersController, StatsController],
  providers: [
    AuthService,
    JwtStrategy,
    CronService,
    PaginationHelper,
    UsersService,
    StatsService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AppModule {}
