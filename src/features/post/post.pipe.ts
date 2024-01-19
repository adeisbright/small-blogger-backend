import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { z } from 'zod';
import { PostDTO } from './post.dto';

const postSchema = z.object({
  title: z.string({
    required_error: 'title is required',
    invalid_type_error: 'title must be a string',
  }),
  content: z.string(),
});
export class AddPostPipe implements PipeTransform {
  transform(value: PostDTO, _: ArgumentMetadata): PostDTO {
    try {
      postSchema.parse(value);
      return value as PostDTO;
    } catch (error) {
      const errorMessages = error.issues.map((e: any) => e.message).join();
      throw new BadRequestException(errorMessages);
    }
  }
}
