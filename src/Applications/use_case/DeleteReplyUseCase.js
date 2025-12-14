class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(requestPayload) {
    this._validatePayload(requestPayload);
    const {
      threadId, commentId, replyId, owner,
    } = requestPayload;
    await this._threadRepository.threadIsExist(threadId);
    await this._commentRepository.commentIsExist(commentId);
    await this._replyRepository.replyIsExist(replyId);
    await this._replyRepository.verifyOwnership(replyId, owner);
    await this._replyRepository.softDeleteReply(replyId);
  }

  _validatePayload(payload) {
    const {
      threadId, commentId, replyId, owner,
    } = payload;

    if (!threadId || !commentId || !replyId || !owner) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    }

    if (
      typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof replyId !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error(
        'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

module.exports = DeleteReplyUseCase;
