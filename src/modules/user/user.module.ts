import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entity/user.entity';
import { UserData } from 'src/common/entity/userdata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserData])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
