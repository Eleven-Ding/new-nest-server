import { SetMetadata } from '@nestjs/common';

export const PUBLICK_KEY = 'isPublic';

export const isPublic = () => SetMetadata(PUBLICK_KEY, true);
