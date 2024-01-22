import { SetMetadata } from '@nestjs/common';
import { PUBLIC_ROUTE } from 'src/constant';

export const PUBLIC = () => SetMetadata(PUBLIC_ROUTE, true);
