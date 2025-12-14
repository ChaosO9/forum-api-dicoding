const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(requestPayload) {
    const { threadId } = requestPayload;
    await this._threadRepository.threadIsExist(threadId);
    const { commentId } = requestPayload;
    await this._commentRepository.commentIsExist(commentId);
    const newReply = new AddReply(requestPayload);
    return this._replyRepository.addReplyOnThreadComment(newReply);
  }
}

module.exports = AddReplyUseCase;
