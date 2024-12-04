import mitt from 'mitt';

/**
 * @file events.js
 *
 * This will serve as an event bus through which different parts of the app will be able to communicate.
 * It uses the event system built into Vue and can be included in any file.
 */

const EventBus = mitt();
export default EventBus;
