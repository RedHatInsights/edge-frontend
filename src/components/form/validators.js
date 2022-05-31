import { reservedUsernames } from './constants/reservedUsernames';

export const reservedUsernameValidator = () => (value) =>
  reservedUsernames.includes(value)
    ? 'This is a username reserved for the system'
    : undefined;
