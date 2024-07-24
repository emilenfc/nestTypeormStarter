import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getTotalCounts() {
    try {
      const [
        totalUsers,
        // totalXXX,
        // totalYYY,...
      ] = await Promise.all([
        this.userRepository.count(),
        // this.xxxRepository.count(),
        // this.yyyRepository.count(),
      ]);
      return {
        totalUsers,
        // totalXXX,
        // totalYYY,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
