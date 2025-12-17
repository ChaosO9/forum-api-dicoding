const CommentDetails = require('../CommentDetails');

describe('CommentDetails entities', () => {
  it('should create CommentDetails object correctly', () => {
    const payload = {
      comments: [
        {
          id: 'comment-111',
          username: 'alam',
          date: '2025-01-08T07:22:33.555Z',
          content: 'lorem ipsum',
          deletedAt: '',
          likeCount: 10,
        },
        {
          id: 'comment-222',
          username: 'bagas',
          date: '2025-01-09T07:26:21.338Z',
          content: 'deleted',
          deletedAt: '2025-01-09T07:26:21.338Z',
          likeCount: 0,
        },
      ],
    };

    const { comments } = new CommentDetails(payload);

    const expectedComment = [
      {
        id: 'comment-111',
        username: 'alam',
        date: '2025-01-08T07:22:33.555Z',
        content: 'lorem ipsum',
        likeCount: 10,
      },
      {
        id: 'comment-222',
        username: 'bagas',
        date: '2025-01-09T07:26:21.338Z',
        content: '**komentar telah dihapus**',
        likeCount: 0,
      },
    ];

    expect(comments).toEqual(expectedComment);
  });
});
