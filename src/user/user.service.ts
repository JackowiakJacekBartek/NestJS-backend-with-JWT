import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/common/dto/createUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  saveUser(createUserDto : CreateUserDto){
    return this.userRepository.save(createUserDto)
  }
}
