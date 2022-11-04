import { levels } from './levels';
import { Logger } from './logger';
import { markExtensionSlot, writeTo } from './operations';
import { ConsoleOutput } from './outputs';
import { LEVEL_SYMBOL, OUTPUT_SYMBOL } from './symbols';

// Specifications:
// - Loggers should be able to filter logs.
// - Users should be able to specify operations to output streams.
// - Loggers should be able to write to other loggers.
// - Logger extensions should be able to decide whether or not to re-export the base slots.
// - Slots should be able to have placeholders.

describe('Logger', () => {
  describe('Log filtering', () => {
    it('should be able to filter by level', () => {
      let accepted;

      const logger = new Logger([
        () => {
          accepted = false;
        },

        (info) => levels[info[LEVEL_SYMBOL]] <= levels.warn,

        () => {
          accepted = true;
        },
      ]);

      logger.error('This should be accepted');
      expect(accepted).toBe(true);

      logger.debug('This should be discarded');
      expect(accepted).toBe(false);

      logger.warn('This should be accepted');
      expect(accepted).toBe(true);

      logger.info('This should be discarded');
      expect(accepted).toBe(false);
    });

    it('should be able to filter by meta', () => {
      let accepted;

      const logger = new Logger([
        () => {
          accepted = false;
        },

        (info) => info.discard !== true,

        () => {
          accepted = true;
        },
      ]);

      logger.info('This should be discarded', { discard: false });
      expect(accepted).toBe(true);

      logger.warn('This should be accepted', { discard: true });
      expect(accepted).toBe(false);

      logger.error('This should be accepted');
      expect(accepted).toBe(true);

      logger.debug('This should be discarded', { discard: true });
      expect(accepted).toBe(false);
    });
  });

  describe('Log outputting', () => {
    it('should be able to output to other loggers', () => {
      let output;

      const otherLogger = new Logger([
        (info) => {
          output = info[OUTPUT_SYMBOL];
        },
      ]);

      const logger = new Logger([writeTo(otherLogger)]);

      logger.info('This should be outputted');
      expect(output).toBe('This should be outputted');
    });

    it('should be able to specify operations to output streams', () => {
      let output;

      const logger = new Logger([
        writeTo(
          new ConsoleOutput([
            (info) => `added prefix: ${info.message}`,
            (info) => {
              output = info[OUTPUT_SYMBOL];
            },
          ]),
        ),
      ]);

      logger.info('original message');
      expect(output).toBe('added prefix: original message');
    });
  });

  describe('Extending', () => {
    it('should be able to be extended', () => {
      let output;

      const logger = new Logger([
        markExtensionSlot('testSlot'),
        (info) => `added prefix: ${info.message}`,
        (info) => {
          output = info[OUTPUT_SYMBOL];
        },
      ]);

      const subLogger = logger.extend({
        testSlot: [
          (info) => {
            info.test = info.message;
          },
        ],
      });

      subLogger.info('This should be logged.');
      expect(output).toBe('added prefix: This should be logged.');
    });

    describe('Slots', () => {
      it('should be able to have placeholders', () => {
        let output;

        const logger = new Logger([
          markExtensionSlot([
            (info) => {
              info.message = 'This is a placeholder.';
            },
          ]),
          (info) => info.message,
          (info) => {
            output = info[OUTPUT_SYMBOL];
          },
        ]);

        const subLogger = logger.extend([]);

        logger.info('This should be ignored.');
        expect(output).toBe('This is a placeholder.');

        subLogger.info('This should be logged.');
        expect(output).toBe('This should be logged.');
      });
    });
  });
});
