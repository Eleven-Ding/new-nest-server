import { UserService } from './../user/user.service';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';

interface IPolicyHandler {
  handle(
    ability: AppAbility,
    user: Request,
    guard: CanActivate,
  ): boolean | Promise<boolean> | Promise<Error>;
}

type PolicyHandlerCallback = (
  ability: AppAbility,
  user: Request,
  guard: CanActivate,
) => boolean | Promise<boolean> | Promise<Error>;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

@Injectable()
export class PoliciesGuard implements CanActivate {
  @Inject()
  public readonly userService: UserService;

  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const ability = this.caslAbilityFactory.createForUser(user);

    const result = policyHandlers.map(async (handler) => {
      return await this.execPolicyHandler(handler, ability, request, this);
    });
    let isPass = true;
    for await (const value of result) {
      if (value instanceof Error) {
        throw value;
      } else if (!value) {
        isPass = false;
        break;
      }
    }
    return isPass;
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    request: Request,
    guard: PoliciesGuard,
  ) {
    if (typeof handler === 'function') {
      return handler(ability, request, guard);
    }
    return handler.handle(ability, request, guard);
  }
}
