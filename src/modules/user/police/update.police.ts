import { UnauthorizedException } from '@nestjs/common';
import { Action, AppAbility } from 'src/modules/casl/casl-ability.factory';
import { PoliciesGuard } from './../../casl/police.guard';
import { Request } from 'express';
import { User, UserRole } from 'src/types';
export async function updateUserPolicyHandler(
  ability: AppAbility,
  request: Request,
  guard: PoliciesGuard,
) {
  const user = request.user as User;
  const { email } = request.body;
  const dbUser = await guard.userService.findOne(email);
  if (user.role === UserRole.Admin) {
    return true;
  }
  if (user.userId !== dbUser.userId) {
    throw new UnauthorizedException('您无权更新他人信息');
  }
  return ability.can(Action.Update, dbUser);
}
