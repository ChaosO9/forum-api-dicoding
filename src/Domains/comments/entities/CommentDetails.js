class CommentDetails {
  constructor(payload) {
    const comments = this._remapPayload(payload);
    this.comments = comments;
  }

  _remapPayload({ comments }) {
    return comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      likeCount: comment.likeCount,
      content: comment.deletedAt
        ? '**komentar telah dihapus**'
        : comment.content,
    }));
  }
}

module.exports = CommentDetails;
