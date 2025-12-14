const GetThreadDetailsByIdUseCase = require('../GetThreadDetailsByIdUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadDetailsByIdUseCase', () => {
  it('should orchestrating the execute action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-h_2FqJ44eqW2-Tlw8VAwbr',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.threadIsExist = jest.fn().mockResolvedValue();
    mockThreadRepository.getThreadDetailsById = jest.fn().mockResolvedValue({
      id: 'thread-h_2FqJ44eqW2-Tlw8VAwbr',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-10-08T07:59:18.982Z',
      username: 'dicoding',
    });
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockResolvedValue([]);
    mockReplyRepository.getRepliesByThreadId = jest
      .fn()
      .mockResolvedValue([]);

    const getThreadDetailsByIdUseCase = new GetThreadDetailsByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetails = await getThreadDetailsByIdUseCase.execute(useCasePayload);

    expect(threadDetails).toStrictEqual({
      thread: {
        id: 'thread-h_2FqJ44eqW2-Tlw8VAwbr',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-10-08T07:59:18.982Z',
        username: 'dicoding',
        comments: [],
      },
    });

    expect(mockThreadRepository.threadIsExist).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockThreadRepository.getThreadDetailsById).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
  });
});
