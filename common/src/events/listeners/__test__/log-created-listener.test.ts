
it('should ack the message', async () => {
  const { msg, data, listener } = await global.emulateLogCreateEvent();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

  expect(data.props.priority).toEqual(3);
  expect(data.props.user).toEqual('Agus');
});
