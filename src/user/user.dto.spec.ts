import { UserDTO } from './user.dto';

describe('UserDto', () => {
  it('should be defined', () => {
    expect(new UserDTO()).toBeDefined();
  });
});
