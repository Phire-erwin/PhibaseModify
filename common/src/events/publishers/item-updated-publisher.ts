import { Publisher, ItemUpdatedEvent, Subjects } from '@phibase/common-v2';

export class ItemUpdatedPublisher extends Publisher<ItemUpdatedEvent> {
  subject: Subjects.ItemUpdated = Subjects.ItemUpdated;
}
