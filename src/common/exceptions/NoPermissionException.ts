import { UnauthorizedException } from '@nestjs/common';

/**
 * @description 具有路有权限，但不具有操作权限时，抛出该异常
 */
export class NoPermissionException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
