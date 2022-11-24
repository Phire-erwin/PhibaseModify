import { Publisher, ItemDeletedEvent, Subjects } from '@phibase/common-v2';

export class ItemDeletedPublisher extends Publisher<ItemDeletedEvent> {
  subject: Subjects.ItemDeleted = Subjects.ItemDeleted;
}
