const RegisterUser = require('../../Domains/users/entities/RegisterUser');

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(requestPayload) {
    const userToRegister = new RegisterUser(requestPayload);
    await this._userRepository.verifyAvailableUsername(userToRegister.username);
    userToRegister.password = await this._passwordHash.hash(userToRegister.password);
    return this._userRepository.addUser(userToRegister);
  }
}

module.exports = AddUserUseCase;
