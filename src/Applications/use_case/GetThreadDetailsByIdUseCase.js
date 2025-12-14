const ThreadDetails = require('../../Domains/threads/entities/ThreadDetails');
const CommentDetails = require('../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../Domains/replies/entities/ReplyDetails');

class GetThreadDetailsByIdUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(requestPayload) {
    const { threadId } = new ThreadDetails(requestPayload);
    await this._threadRepository.threadIsExist(threadId);

    const threadDetails = await this._threadRepository.getThreadDetailsById(threadId);
    const threadComments = await this._commentRepository.getCommentsByThreadId(threadId);
    const threadReplies = await this._replyRepository.getRepliesByThreadId(threadId);

    const formattedComments = threadComments
      .filter((comment) => comment.threadId === threadId)
      .map((comment) => {
        const replies = threadReplies
          .filter((reply) => reply.commentId === comment.id)
          .map((reply) => ({
            ...new ReplyDetails({ replies: [reply] }).replies[0],
          }));

        return {
          ...new CommentDetails({ comments: [comment] }).comments[0],
          replies,
        };
      });

    return {
      thread: {
        ...threadDetails,
        comments: formattedComments,
      },
    };
  }
}

module.exports = GetThreadDetailsByIdUseCase;
