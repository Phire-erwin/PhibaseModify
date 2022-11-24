import { Publisher, UserLoginEvent, Subjects } from '@phibase/common-v2';

export class UserLoginPublisher extends Publisher<UserLoginEvent> {
  subject: Subjects.UserLogin = Subjects.UserLogin;
}
