const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should throw error if payload not contain thread id and comment id', async () => {
    const requestPayload = {};
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(
      deleteCommentUseCase.execute(requestPayload),
    ).rejects.toThrow('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
  });

  it('should throw error if payload not typed as string', async () => {
    const requestPayload = {
      threadId: 111,
      commentId: 111,
      owner: 111,
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(
      deleteCommentUseCase.execute(requestPayload),
    ).rejects.toThrow(
      'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrating the execute action correctly', async () => {
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

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(requestPayload);

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
