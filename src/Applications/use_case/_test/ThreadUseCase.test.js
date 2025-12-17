const ThreadUseCase = require('../ThreadUseCase');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('ThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the createNewThread action correctly', async () => {
    // Arrange
    const requestPayload = {
      title: 'Redemption Arc',
      body: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      owner: 'user-111',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-111',
      title: requestPayload.title,
      owner: requestPayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.createNewThread = jest
      .fn()
      .mockImplementation()
      .mockResolvedValue(mockAddedThread);

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await threadUseCase.createNewThread(requestPayload);

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-111',
        title: requestPayload.title,
        owner: requestPayload.owner,
      }),
    );

    expect(mockThreadRepository.createNewThread).toHaveBeenCalledWith(
      new NewThread({
        title: requestPayload.title,
        body: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        owner: requestPayload.owner,
      }),
    );
  });

  it('should get details thread return correctly', async () => {
    const requestPayload = {
      threadId: 'thread-222',
    };

    const expectedThread = {
      id: 'thread-222',
      title: 'Redemption Arc',
      body: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      date: '2025-08-08T07:19:09.775Z',
      username: 'alam',
    };

    const expectedComment = [
      {
        id: 'comment-111',
        threadId: 'thread-222',
        username: 'bagas',
        date: '2025-08-08T07:22:33.555Z',
        content: 'lorem ipsum dolor sit amet',
        deletedAt: '',
        likeCount: 0,
      },
      {
        id: 'comment-222',
        threadId: 'thread-222',
        username: 'restu',
        date: '2025-08-08T07:26:21.338Z',
        content: 'deleted',
        deletedAt: '2025-08-08T09:23:30.756Z',
        likeCount: 0,
      },
    ];

    const expectedReply = [
      {
        id: 'reply-111',
        commentId: 'comment-111',
        username: 'alam',
        date: '2025-08-08T07:22:33.555Z',
        content: 'lorem ipsum dolor sit amet',
        deletedAt: '',
      },
      {
        id: 'reply-222',
        commentId: 'comment-111',
        username: 'bagas',
        date: '2025-08-08T07:26:21.338Z',
        content: 'deleted',
        deletedAt: '2025-08-08T09:23:30.756Z',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.threadIsExist = jest.fn(() => Promise.resolve());

    mockThreadRepository.getThreadDetailsById = jest
      .fn()
      .mockResolvedValue(expectedThread);
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockResolvedValue(expectedComment);
    mockReplyRepository.getRepliesByThreadId = jest
      .fn()
      .mockResolvedValue(expectedReply);

    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const detailThread = await threadUseCase.getThreadDetailsById(
      requestPayload,
    );

    expect(mockThreadRepository.threadIsExist).toHaveBeenCalledWith(
      requestPayload.threadId,
    );
    expect(mockThreadRepository.getThreadDetailsById).toHaveBeenCalledWith(
      requestPayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      requestPayload.threadId,
    );
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(
      requestPayload.threadId,
    );

    expect(detailThread).toStrictEqual({
      thread: {
        id: 'thread-222',
        title: 'Redemption Arc',
        body: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        date: '2025-08-08T07:19:09.775Z',
        username: 'alam',
        comments: [
          {
            id: 'comment-111',
            username: 'bagas',
            date: '2025-08-08T07:22:33.555Z',
            replies: [
              {
                id: 'reply-111',
                content: 'lorem ipsum dolor sit amet',
                date: '2025-08-08T07:22:33.555Z',
                username: 'alam',
              },
              {
                id: 'reply-222',
                content: '**balasan telah dihapus**',
                date: '2025-08-08T07:26:21.338Z',
                username: 'bagas',
              },
            ],
            content: 'lorem ipsum dolor sit amet',
            likeCount: 0,
          },
          {
            id: 'comment-222',
            username: 'restu',
            date: '2025-08-08T07:26:21.338Z',
            replies: [],
            content: '**komentar telah dihapus**',
            likeCount: 0,
          },
        ],
      },
    });
  });
});
