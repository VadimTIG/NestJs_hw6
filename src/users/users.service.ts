import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user-dtos';
import { Role } from '../auth/role/role.enum';
import { hash } from '../utils/crypto';
import { UpdateUserDto } from './dtos/update-user-dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async create(user: CreateUserDto): Promise<object> {
    const usersEntity = new UsersEntity();
    usersEntity.firstName = user.firstName;
    usersEntity.avatar = user.avatar;
    usersEntity.email = user.email;
    usersEntity.roles = user.roles;
    // хэшируем пароль
    usersEntity.password = await hash(user.password);
    const { password, ...result } = await this.usersRepository.save(
      usersEntity,
    );
    return { result };
  }

  async findById(id: number): Promise<UsersEntity> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    return this.usersRepository.findOneBy({ email });
  }

  async setModerator(idUser: number): Promise<UsersEntity> {
    const _user = await this.findById(idUser);
    if (!_user) {
      throw new UnauthorizedException();
    }
    _user.roles = Role.Moderator;
    return this.usersRepository.save(_user);
  }

  async edit(id: number, user: UpdateUserDto): Promise<boolean | Error> {
    try {
      const findUser = await this.findById(id);
      if (findUser) {
        const userEntity = new UsersEntity();
        userEntity.firstName = user.firstName || findUser.firstName;
        userEntity.email = user.email || findUser.email;
        userEntity.password = (await hash(user.password)) || findUser.password;
        userEntity.roles = findUser.roles;
        userEntity.avatar = user.avatar || findUser.avatar;
        await this.usersRepository.update(id, userEntity);
        return true;
      }
      return null;
    } catch (error) {
      return new Error(`Произошла ошибка: ${error}`);
    }
  }
}
