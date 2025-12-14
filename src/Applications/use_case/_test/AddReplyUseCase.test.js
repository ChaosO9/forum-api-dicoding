const AddReplyUseCase = require('../AddReplyUseCase');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the execute action correctly', async () => {
    const requestPayload = {
      threadId: 'thread-h_2FqJ44eqW2-Tlw8VAwbr',
      commentId: 'comment-_pby2DHYXNIma5FAqRzt',
      content: 'sebuah balasan',
      owner: 'user-zzp05obIx_VHZa25sKqV',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-BERJfnGQhY7mVs6YId_ksss',
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

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const addedReply = await addReplyUseCase.execute(requestPayload);

    expect(mockThreadRepository.threadIsExist).toHaveBeenCalledWith(
      requestPayload.threadId,
    );
    expect(mockCommentRepository.commentIsExist).toHaveBeenCalledWith(
      requestPayload.commentId,
    );
    expect(mockReplyRepository.addReplyOnThreadComment).toHaveBeenCalledWith(
      new AddReply(requestPayload),
    );
    expect(addedReply).toStrictEqual(mockAddedReply);
  });
});
