const CreateNewThreadUseCase = require('../CreateNewThreadUseCase');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('CreateNewThreadUseCase', () => {
  it('should orchestrating the execute action correctly', async () => {
    const requestPayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-h_2FqJ44eqW2-Tlw8VAwbr',
      title: requestPayload.title,
      owner: requestPayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.createNewThread = jest
      .fn()
      .mockResolvedValue(mockAddedThread);

    const createNewThreadUseCase = new CreateNewThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await createNewThreadUseCase.execute(requestPayload);

    expect(addedThread).toStrictEqual(mockAddedThread);
    expect(mockThreadRepository.createNewThread).toHaveBeenCalledWith(
      new NewThread(requestPayload),
    );
  });
});
