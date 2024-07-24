import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller({ path: 'statistic', version: '1' })
@ApiTags('Statistics')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('total')
  async getStats() {
    const stats = await this.statsService.getTotalCounts();
    return {
      message: 'total number of records fetched successfully',
      stats,
    };
  }
}
