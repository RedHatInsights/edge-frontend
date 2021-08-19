import { reservedUsernames } from './constants';

export const reservedUsernameValidator = () => (value) =>
  reservedUsernames.includes(value)
    ? 'This is a reserved username for the system'
    : undefined;
