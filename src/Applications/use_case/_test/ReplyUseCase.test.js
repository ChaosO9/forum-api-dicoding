const ReplyUseCase = require('../ReplyUseCase');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('ReplyUseCase', () => {
  it('should orchestrating the addReplyOnThreadComment action correctly', async () => {
    const requestPayload = {
      threadId: 'thread-111',
      commentId: 'comment-111',
      content: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      owner: 'user-111',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-111',
      content: requestPayload.content,
      owner: requestPayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.threadIsExist = jest.fn().mockResolvedValue();
    mockCommentRepository.commentIsExist = jest.fn().mockResolvedValue();
    mockReplyRepository.addReplyOnThreadComment = jest
      .fn()
      .mockResolvedValue(mockAddedReply);

    const replyUseCase = new ReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    const addedReply = await replyUseCase.addReplyOnThreadComment(
      requestPayload,
    );

    expect(mockThreadRepository.threadIsExist).toHaveBeenCalledWith(
      requestPayload.threadId,
    );
    expect(mockCommentRepository.commentIsExist).toHaveBeenCalledWith(
      requestPayload.commentId,
    );
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: 'reply-111',
        content: requestPayload.content,
        owner: requestPayload.owner,
      }),
    );
    expect(mockReplyRepository.addReplyOnThreadComment).toHaveBeenCalledWith(
      new AddReply({
        threadId: requestPayload.threadId,
        commentId: requestPayload.commentId,
        content: requestPayload.content,
        owner: requestPayload.owner,
      }),
    );
  });

  it('should throw error if softDeleteReply payload not contain thread id and comment id', async () => {
    const requestPayload = {};
    const replyUseCase = new ReplyUseCase({});

    await expect(replyUseCase.softDeleteReply(requestPayload)).rejects.toThrow(
      'DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD',
    );
  });

  it('should throw error if softDeleteReply payload not typed as string', async () => {
    const requestPayload = {
      threadId: 111,
      commentId: 111,
      replyId: 111,
      owner: 111,
    };
    const replyUseCase = new ReplyUseCase({});
    await expect(replyUseCase.softDeleteReply(requestPayload)).rejects.toThrow(
      'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrating the softDeleteReply action correctly', async () => {
    const requestPayload = {
      threadId: 'thread-222',
      commentId: 'comment-222',
      replyId: 'reply-222',
      owner: 'user-222',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.threadIsExist = jest.fn().mockResolvedValue();
    mockCommentRepository.commentIsExist = jest.fn().mockResolvedValue();
    mockReplyRepository.replyIsExist = jest.fn().mockResolvedValue();
    mockReplyRepository.verifyOwnership = jest.fn().mockResolvedValue();
    mockReplyRepository.softDeleteReply = jest.fn().mockResolvedValue();

    const replyUseCase = new ReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await replyUseCase.softDeleteReply(requestPayload);

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
