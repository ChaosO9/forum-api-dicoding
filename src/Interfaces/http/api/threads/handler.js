const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailsHandler = this.getThreadDetailsHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const requestPayload = {
      title: request.payload.title,
      body: request.payload.body,
      owner,
    };
    const addedThread = await threadUseCase.createNewThread(requestPayload);
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailsHandler(request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const requestPayload = {
      threadId: request.params.id,
    };
    const { thread } = await threadUseCase.getThreadDetailsById(requestPayload);
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    return response;
  }
}

module.exports = ThreadsHandler;
