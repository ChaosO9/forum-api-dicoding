/* istanbul ignore file */
// This file is deprecated. Use AddCommentUseCase and DeleteCommentUseCase instead.
// Kept for backward compatibility during refactoring.

const AddCommentUseCase = require('./AddCommentUseCase');
const DeleteCommentUseCase = require('./DeleteCommentUseCase');

class CommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._addCommentUseCase = new AddCommentUseCase({
      threadRepository,
      commentRepository,
    });
    this._deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository,
      commentRepository,
    });
  }

  async addCommentOnThread(requestPayload) {
    return this._addCommentUseCase.execute(requestPayload);
  }

  async softDeleteComment(requestPayload) {
    return this._deleteCommentUseCase.execute(requestPayload);
  }
}

module.exports = CommentUseCase;
