/* istanbul ignore file */
// This file is deprecated. Use AddReplyUseCase and DeleteReplyUseCase instead.
// Kept for backward compatibility during refactoring.

const AddReplyUseCase = require('./AddReplyUseCase');
const DeleteReplyUseCase = require('./DeleteReplyUseCase');

class ReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._addReplyUseCase = new AddReplyUseCase({
      threadRepository,
      commentRepository,
      replyRepository,
    });
    this._deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository,
      commentRepository,
      replyRepository,
    });
  }

  async addReplyOnThreadComment(requestPayload) {
    return this._addReplyUseCase.execute(requestPayload);
  }

  async softDeleteReply(requestPayload) {
    return this._deleteReplyUseCase.execute(requestPayload);
  }
}

module.exports = ReplyUseCase;
