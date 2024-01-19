import { TestingModule, Test } from '@nestjs/testing';
import { PostService } from './post.service';

describe('Blog Service', () => {
  let postService: PostService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService],
    }).compile();

    postService = module.get<PostService>(PostService);
  });
  describe('Get Posts', () => {
    it('Should return empty posts', async () => {
      const expectedResults: Record<string, any> = [];
      jest.spyOn(postService, 'getPosts').mockResolvedValue(expectedResults);
      const posts = await postService.getPosts();
      expect(posts).toEqual(expectedResults);
    });

    it('Should throw error when error occurs', async () => {
      jest
        .spyOn(postService, 'getPosts')
        .mockRejectedValue(new Error('Error Occured'));
      let errorResult: any;
      try {
        await postService.getPosts();
      } catch (e) {
        errorResult = e;
      }
      expect(errorResult).toBeInstanceOf(Error);
      expect(errorResult.message).toEqual('Error Occured');
    });
  });
});
