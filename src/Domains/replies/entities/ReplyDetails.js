class ReplyDetails {
  constructor(payload) {
    const replies = this._remapPayload(payload);
    this.replies = replies;
  }

  _remapPayload({ replies }) {
    return replies.map((reply) => ({
      id: reply.id,
      username: reply.username,
      date: reply.date,
      content: reply.deletedAt ? '**balasan telah dihapus**' : reply.content,
    }));
  }
}

module.exports = ReplyDetails;
