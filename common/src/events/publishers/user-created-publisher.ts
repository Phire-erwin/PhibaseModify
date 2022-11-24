import { Publisher, UserCreatedEvent, Subjects } from '@phibase/common-v2';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
