import { Publisher, UserUpdatedEvent, Subjects } from '@phibase/common-v2';

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
