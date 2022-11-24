import { Publisher, UserDeletedEvent, Subjects } from '@phibase/common-v2';

export class UserDeletedPublisher extends Publisher<UserDeletedEvent> {
  subject: Subjects.UserDeleted = Subjects.UserDeleted;
}
