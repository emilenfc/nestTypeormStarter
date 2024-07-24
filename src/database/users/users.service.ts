import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Between,
  ILike,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationHelper } from '../helper/pagination.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationHelper: PaginationHelper,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  // async findAll(pageSize?: number, pageNumber?: number) {
  //   return await this.paginationHelper.paginate(
  //     this.userRepository,
  //     pageSize,
  //     pageNumber,
  //     {
  //       order: {
  //         createdAt: 'DESC',
  //       },
  //     },
  //   );
  // }

  async findAllUsers(
    pageSize?: number,
    pageNumber?: number,
    from?: string,
    to?: string,
    active?: string,
    search?: string,
  ) {
    const filter = {
      where: [],
      order: {
        createdAt: 'DESC',
      },
    };

    if (from && to) filter.where.push({ createdAt: Between(from, to) });
    else if (from) filter.where.push({ createdAt: MoreThanOrEqual(from) });
    else if (to) filter.where.push({ createdAt: LessThanOrEqual(to) });
    if (active) {
      filter.where.push({ active });
    }
    if (search) {
      filter.where.push([
        { firstName: ILike(`%${search}%`) },
        { midName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ]);
    }

    return this.paginationHelper.paginate(
      this.userRepository,
      pageSize,
      pageNumber,
      filter,
    );
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException();
      }
      if (user.active === true) {
        user.active = false;
        const data = await this.userRepository.save(user);
        return {
          message: 'User deactivated successfully',
          data,
        };
      }
      user.active = true;
      const data = await this.userRepository.save(user);
      return {
        message: 'User restored successfully',
        data,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
