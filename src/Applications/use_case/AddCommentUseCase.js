const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(requestPayload) {
    const { threadId } = requestPayload;
    await this._threadRepository.threadIsExist(threadId);
    const newComment = new AddComment(requestPayload);
    return this._commentRepository.addCommentOnThread(newComment);
  }
}

module.exports = AddCommentUseCase;
