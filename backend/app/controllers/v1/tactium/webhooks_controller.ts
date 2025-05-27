import type { HttpContext } from '@adonisjs/core/http';
import WebhookEventHandler from '#services/socket/webhook_event_handler';
import { IPayloadWebHook } from '#helpers/web_socket_interfaces.js';
export default class WebhooksController {
  public async handle({ request, response }: HttpContext) {
    const body = request.body();

    // Validate required properties
    if (
      typeof body.evento === 'undefined' ||
      typeof body.status === 'undefined' ||
      typeof body.dispositivo === 'undefined' ||
      typeof body.dados === 'undefined'
    ) {
      return response
        .status(400)
        .send('Invalid payload: missing required properties');
    }

    // Delega o tratamento do evento para o serviço
    await WebhookEventHandler.handleEvent(body as IPayloadWebHook);

    response.status(200).send('OK');
  }
}
