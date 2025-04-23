import { SetMetadata } from '@nestjs/common';

export const AaaFunctionDecorator = (...args: string[]) => {
  console.log('aaa function decorator', args);

  return SetMetadata('aaa', args);
};
