const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the execute action correctly', async () => {
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

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addedComment = await addCommentUseCase.execute(requestPayload);

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
});
