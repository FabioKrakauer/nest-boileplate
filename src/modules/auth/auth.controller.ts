import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { SignUpDto } from "./dto/SignUp.dto";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/SignIn.dto";
import { JwtAuthGuard } from "./guards/jwt.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-up')
    async signup(@Body() signupDto: SignUpDto) {
        return this.authService.createUser(signupDto);
    }

    @Post('sign-in')
    async login(@Body() loginDto: SignInDto) {
        const user = await this.authService.isValidUser(loginDto.email, loginDto.password);
        return this.authService.login(user);
    }


    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Req() req) {
        return req.user;
    }
}