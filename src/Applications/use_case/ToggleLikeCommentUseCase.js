class ToggleLikeCommentUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;
    await this._threadRepository.threadIsExist(threadId);
    await this._commentRepository.commentIsExist(commentId);

    const isLikeExist = await this._likeRepository.checkLikeIsExists(owner, commentId);

    if (isLikeExist) {
      await this._likeRepository.deleteLike(owner, commentId);
    } else {
      await this._likeRepository.addLike(owner, commentId);
    }
  }
}

module.exports = ToggleLikeCommentUseCase;
