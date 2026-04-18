import { AuthService } from './auth.service';
import { RegisterMasterDto } from './dto/register-master.dto';
import { RegisterTenantAdminDto } from './dto/register-tenant-admin.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerMaster(registerMasterDto: RegisterMasterDto, currentUser: any): Promise<{
        message: string;
    }>;
    registerTenantAdmin(registerTenantAdminDto: RegisterTenantAdminDto, currentUser: any): Promise<{
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
