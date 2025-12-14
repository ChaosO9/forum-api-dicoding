const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyUseCase', () => {
  it('should throw error if payload not contain valid payload', async () => {
    const requestPayload = {};
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(
      deleteReplyUseCase.execute(requestPayload),
    ).rejects.toThrow('DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
  });

  it('should throw error if payload not typed as string', async () => {
    const requestPayload = {
      threadId: 123,
      commentId: 123,
      replyId: 123,
      owner: 123,
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(
      deleteReplyUseCase.execute(requestPayload),
    ).rejects.toThrow(
      'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrating the execute action correctly', async () => {
    const requestPayload = {
      threadId: 'thread-h_2FqJ44eqW2-Tlw8VAwbr',
      commentId: 'comment-_pby2DHYXNIma5FAqRzt',
      replyId: 'reply-BERJfnGQhY7mVs6YId_ksss',
      owner: 'user-zzp05obIx_VHZa25sKqV',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.threadIsExist = jest.fn().mockResolvedValue();
    mockCommentRepository.commentIsExist = jest.fn().mockResolvedValue();
    mockReplyRepository.replyIsExist = jest.fn().mockResolvedValue();
    mockReplyRepository.verifyOwnership = jest.fn().mockResolvedValue();
    mockReplyRepository.softDeleteReply = jest.fn().mockResolvedValue();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(requestPayload);

    expect(mockThreadRepository.threadIsExist).toHaveBeenCalledWith(
      requestPayload.threadId,
    );
    expect(mockCommentRepository.commentIsExist).toHaveBeenCalledWith(
      requestPayload.commentId,
    );
    expect(mockReplyRepository.replyIsExist).toHaveBeenCalledWith(
      requestPayload.replyId,
    );
    expect(mockReplyRepository.verifyOwnership).toHaveBeenCalledWith(
      requestPayload.replyId,
      requestPayload.owner,
    );
    expect(mockReplyRepository.softDeleteReply).toHaveBeenCalledWith(
      requestPayload.replyId,
    );
  });
});
