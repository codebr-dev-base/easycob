import logger from '@adonisjs/core/services/logger';
import emitter from '@adonisjs/core/services/emitter';

emitter.on('db:query', function (query) {
    logger.debug(query);
});