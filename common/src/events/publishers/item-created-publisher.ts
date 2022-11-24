import { Publisher, ItemCreatedEvent, Subjects } from '@phibase/common-v2';

export class ItemCreatedPublisher extends Publisher<ItemCreatedEvent> {
  subject: Subjects.ItemCreated = Subjects.ItemCreated;
}
