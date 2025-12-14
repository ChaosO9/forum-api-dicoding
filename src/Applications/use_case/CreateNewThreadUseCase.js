const NewThread = require('../../Domains/threads/entities/NewThread');

class CreateNewThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(requestPayload) {
    const newThread = new NewThread(requestPayload);
    return this._threadRepository.createNewThread(newThread);
  }
}

module.exports = CreateNewThreadUseCase;
