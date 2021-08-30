import { reservedUsernames } from './constants';

export const reservedUsernameValidator = () => (value) =>
  reservedUsernames.includes(value)
    ? 'This is a username reserved for the system'
    : undefined;
