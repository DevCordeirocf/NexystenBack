import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerUserDto: RegisterUserDto): Promise<{
        message: string;
    }>;
    registerCustomer(registerCustomerDto: RegisterCustomerDto, tenantId: string): Promise<{
        message: string;
        userId: string;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        access_token: string;
    }>;
}
