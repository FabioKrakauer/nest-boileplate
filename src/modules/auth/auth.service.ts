import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/SignUp.dto';
import { BcryptService } from './bcrypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        private bcryptService: BcryptService,
        private jwtService: JwtService,
    ) {}


    async createUser(userDto: SignUpDto) {
        const alreadyExists = await this.userRepository.findOne({
            where: { email: userDto.email },
        });

        if (alreadyExists) {
            throw new BadRequestException('User already exists');
        }

        userDto.password = await this.bcryptService.hashPassword(userDto.password);

        return await this.userRepository.save(userDto);
    }


    async isValidUser(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: { email },
        });

        console.log("USER", user);
        console.log("PASSWORD", password);
        if (!user) {
            throw new BadRequestException('Invalid credentials23232');
        }

        const isCorrectPassword = await this.bcryptService.isCorrectPassword(password, user.password);

        if (!isCorrectPassword) {
            throw new BadRequestException('Invalid credentials');
        }

        return user;
    }

    async login(user: User) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '1d', secret: process.env.JWT_SECRET }),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '30d', secret: process.env.JWT_SECRET }),
        };
    }

    async refreshToken(refreshToken: string) {
        const payload = this.jwtService.verify(refreshToken);
        return this.login(payload);
    }
}

