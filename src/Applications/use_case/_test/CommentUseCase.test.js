const CommentUseCase = require('../CommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('CommentUseCase', () => {
  it('should orchestrating the addCommentOnThread action correctly', async () => {
    const requestPayload = {
      threadId: 'thread-111',
      content: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      owner: 'user-111',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-111',
      content: requestPayload.content,
      owner: requestPayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.threadIsExist = jest.fn().mockResolvedValue();
    mockCommentRepository.addCommentOnThread = jest
      .fn()
      .mockResolvedValue(mockAddedComment);

    const commentUseCase = new CommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const addedComment = await commentUseCase.addCommentOnThread(
      requestPayload,
    );

    expect(mockThreadRepository.threadIsExist).toHaveBeenCalledWith(
      requestPayload.threadId,
    );
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-111',
        content: requestPayload.content,
        owner: requestPayload.owner,
      }),
    );
    expect(mockCommentRepository.addCommentOnThread).toHaveBeenCalledWith(
      new AddComment({
        threadId: requestPayload.threadId,
        content: requestPayload.content,
        owner: requestPayload.owner,
      }),
    );
  });

  it('should throw error if softDeleteComment action payload not contain thread id and comment id', async () => {
    const requestPayload = {};
    const commentUseCase = new CommentUseCase({});

    await expect(
      commentUseCase.softDeleteComment(requestPayload),
    ).rejects.toThrow('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
  });

  it('should throw error if softDeleteComment payload not typed as string', async () => {
    const requestPayload = {
      threadId: 111,
      commentId: 111,
      owner: 111,
    };
    const commentUseCase = new CommentUseCase({});
    await expect(
      commentUseCase.softDeleteComment(requestPayload),
    ).rejects.toThrow(
      'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrating the softDeleteComment action correctly', async () => {
    const requestPayload = {
      threadId: 'thread-111',
      commentId: 'comment-111',
      owner: 'user-111',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.threadIsExist = jest.fn().mockResolvedValue();
    mockCommentRepository.commentIsExist = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyOwnership = jest.fn().mockResolvedValue();
    mockCommentRepository.softDeleteComment = jest.fn().mockResolvedValue();

    const commentUseCase = new CommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await commentUseCase.softDeleteComment(requestPayload);

    expect(mockThreadRepository.threadIsExist).toHaveBeenCalledWith(
      requestPayload.threadId,
    );
    expect(mockCommentRepository.commentIsExist).toHaveBeenCalledWith(
      requestPayload.commentId,
    );
    expect(mockCommentRepository.verifyOwnership).toHaveBeenCalledWith(
      requestPayload.commentId,
      requestPayload.owner,
    );
    expect(mockCommentRepository.softDeleteComment).toHaveBeenCalledWith(
      requestPayload.commentId,
    );
  });
});
