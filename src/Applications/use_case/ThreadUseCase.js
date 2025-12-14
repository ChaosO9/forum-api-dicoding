/* istanbul ignore file */
// This file is deprecated. Use CreateNewThreadUseCase and GetThreadDetailsByIdUseCase instead.
// Kept for backward compatibility during refactoring.

const CreateNewThreadUseCase = require('./CreateNewThreadUseCase');
const GetThreadDetailsByIdUseCase = require('./GetThreadDetailsByIdUseCase');

class ThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._createNewThreadUseCase = new CreateNewThreadUseCase({
      threadRepository,
    });
    this._getThreadDetailsByIdUseCase = new GetThreadDetailsByIdUseCase({
      threadRepository,
      commentRepository,
      replyRepository,
    });
  }

  async createNewThread(requestPayload) {
    return this._createNewThreadUseCase.execute(requestPayload);
  }

  async getThreadDetailsById(requestPayload) {
    return this._getThreadDetailsByIdUseCase.execute(requestPayload);
  }
}

module.exports = ThreadUseCase;
