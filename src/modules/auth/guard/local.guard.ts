import { AuthGuard } from '@nestjs/passport';

export class LocalStrategyGuard extends AuthGuard('local') {}
