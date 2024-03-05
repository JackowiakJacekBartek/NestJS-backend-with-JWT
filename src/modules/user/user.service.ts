import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/common/dto/createUserDto';
import { UpdateLoginDto, UpdateUserDataDto } from 'src/common/dto/updateUserDto';
import { UserData } from 'src/common/entity/userdata.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>

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

  async findUserById(id: number) {
    return await this.userRepository.findOne({ where: { id }, relations: ['userData'] });
  }

  async getUserDataById(id: number) {
    let existingUser = await this.findUserById(id);
    if(!existingUser){
      throw new NotFoundException();
    }
    return existingUser.userData;
  }

  async confirmEmail(email: string){
    let user = await this.findByEmail(email);
    user.isConfirmedEmail = true;
    user.emailVerificationCode = null;
    return await this.userRepository.save(user);
  }

  async updateUserData(id: number, updateUserDataDto: UpdateUserDataDto) {
    // Pobierz użytkownika
    let existingUser = await this.findUserById(id);
  
    // Sprawdź, czy użytkownik istnieje
    if (existingUser) {

      if (!existingUser.userData) {
        let userData = new UserData();
        existingUser.userData = userData
      }
  
      // Ustaw nowe wartości dla pól UserData
      Object.assign(existingUser.userData, updateUserDataDto);
  
      // Zapisz dane userData
      //await this.userDataRepository.save(userData);
      await this.userRepository.save(existingUser);

      return existingUser.userData;
    } else {
      throw new UnauthorizedException();
    }
  }
}
