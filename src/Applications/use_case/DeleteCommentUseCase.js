class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(requestPayload) {
    this._validatePayload(requestPayload);
    const { threadId, commentId, owner } = requestPayload;
    await this._threadRepository.threadIsExist(threadId);
    await this._commentRepository.commentIsExist(commentId);
    await this._commentRepository.verifyOwnership(commentId, owner);
    await this._commentRepository.softDeleteComment(commentId);
  }

  _validatePayload(payload) {
    const { threadId, commentId, owner } = payload;

    if (!threadId || !commentId || !owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    }

    if (
      typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

module.exports = DeleteCommentUseCase;
