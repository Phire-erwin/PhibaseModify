import { Message } from 'node-nats-streaming';
import { Subjects, Listener, LogCreatedEvent } from '@phibase/common-v2';
import { Log } from '../../models/log';
import { queueGroupName } from './queue-group-name';

export class LogCreatedListener extends Listener<LogCreatedEvent> {
  subject: Subjects.LogCreated = Subjects.LogCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: LogCreatedEvent['data'], msg: Message) {
    const { app,domain,props } = data;
    /*

    */
    const logData = new Log({
      app:app,
      domain:domain,
      props: props,

    });
    await logData.save();

    msg.ack();
  }
}
