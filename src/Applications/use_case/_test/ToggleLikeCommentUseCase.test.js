const ToggleLikeCommentUseCase = require('../ToggleLikeCommentUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('ToggleLikeCommentUseCase', () => {
  it('should orchestrate the toggle like action correctly when like not exists', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.threadIsExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.commentIsExist = jest.fn(() => Promise.resolve());
    mockLikeRepository.checkLikeIsExists = jest.fn(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve('like-123'));

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.threadIsExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.commentIsExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkLikeIsExists).toBeCalledWith(useCasePayload.owner, useCasePayload.commentId);
    expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload.owner, useCasePayload.commentId);
  });

  it('should orchestrate the toggle like action correctly when like exists', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.threadIsExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.commentIsExist = jest.fn(() => Promise.resolve());
    mockLikeRepository.checkLikeIsExists = jest.fn(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.threadIsExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.commentIsExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkLikeIsExists).toBeCalledWith(useCasePayload.owner, useCasePayload.commentId);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(useCasePayload.owner, useCasePayload.commentId);
  });
});
