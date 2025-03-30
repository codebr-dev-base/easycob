import type { HttpContext } from '@adonisjs/core/http';
import SocketIoProvider from '#providers/socket_io_provider';

export default class WebhooksController {
  public async handle({ request, response }: HttpContext) {
    const io = SocketIoProvider.getInstance();
    const body = request.body();
    console.log(body);
    io.emit('webhook', body);
    response.status(200).send('OK');
  }
}
