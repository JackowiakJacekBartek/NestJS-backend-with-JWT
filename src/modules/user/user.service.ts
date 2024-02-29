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
    private userRepository: Repository<User>,
    @InjectRepository(UserData)
    private userDataRepository: Repository<UserData>,

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
    const user = await this.userRepository.findOne({ where: { id } });
    const { password, ...result } = user;
    return result;
  }

  async confirmEmail(email: string){
    let user = await this.findByEmail(email);
    user.isConfirmedEmail = true;
    return await this.userRepository.save(user);
  }

  async updateLoginByEmail(email: string, user: Partial<UpdateLoginDto>) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      if (Object.keys(user).length > 0) {
        await this.userRepository.update(existingUser.id, user);
        return await this.userRepository.findOne({ where: { email } });
      } else {
        throw new BadRequestException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  async updateUserData(id: number, updateUserDataDto: UpdateUserDataDto) {

    // Pobierz użytkownika
    let existingUser = await this.userRepository.findOne({ where: { id }, relations: ['userData'] });
  
    // Sprawdź, czy użytkownik istnieje
    if (existingUser) {
      // Sprawdź, czy istnieją dane userData dla tego użytkownika
      let userData = await this.userDataRepository.findOne({ where: { user: existingUser } });
  
      // Jeśli nie ma danych userData, utwórz nowy obiekt UserData
      // if (!userData) {
      //   userData = new UserData();
      //   userData.user = existingUser;
      // }

      if (!userData) {
        userData = new UserData();
        existingUser.userData = userData
      }
  
      // Ustaw nowe wartości dla pól UserData
      Object.assign(userData, updateUserDataDto);
  
      // Zapisz dane userData
      await this.userDataRepository.save(userData);
      await this.userRepository.save(existingUser);

      return await this.userRepository.findOne({ where: { id }, relations: ['userData'] });
    } else {
      console.log('User not found');
    }
  }
}
