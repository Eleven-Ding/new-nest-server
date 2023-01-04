import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User, UserRole } from 'src/types';
import { ROLES_KEY } from 'src/common/decorates/Roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const user = context.switchToHttp().getRequest().user as User;
    // 到了这里，如果 user 不存在，那么就只能是不需要登录就能够访问的资源,不用做任何限制
    if (!user) {
      return true;
    }
    const { role } = user;
    // 因为比较多的接口都是普通用户能够访问的，所以这里就简化了，没有使用 @Roles 描述的接口都是用户可以访问的
    if (!roles || roles.length === 0 || role === UserRole.Admin) {
      return true;
    }
    return roles.includes(role);
  }
}
