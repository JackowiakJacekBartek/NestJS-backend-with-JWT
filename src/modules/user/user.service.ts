import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/common/dto/createUserDto';
import { UpdateUserDto } from 'src/common/dto/updateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async saveUser(user: CreateUserDto) {
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getAllUsers() {
    return this.userRepository.find();
  }

  async updateUserById(id: number, user: Partial<UpdateUserDto>) {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (existingUser) {
      if (Object.keys(user).length > 0) {
        await this.userRepository.update(id, user);
        return await this.userRepository.findOne({ where: { id } });
      } else {
        throw new BadRequestException();
      }
    } else {
      throw new NotFoundException();
    }
  } 
}
