/*
* TODO: Add validation here :
*   - Validate type
*   - Maybe autoClose
*   - Maybe closeButton as well
* */
import EventManager from './util/EventManager';
import config from './config';

const { POSITION, TYPE, ACTION } = config;

const defaultOptions = {
  type: TYPE.DEFAULT,
  autoClose: null,
  closeButton: null,
  hideProgressBar: null
};

function mergeOptions(options) {
  return Object.assign({}, defaultOptions, options);
}

let isContainerMounted = false;
let queue = [];

EventManager.on(ACTION.MOUNTED, () => {
  isContainerMounted = true;
  queue.forEach(item => {
    EventManager.emit(item.action, item.content, item.options);
  });
  queue = [];
});

const emitEvent = (content, options) => {
  if (isContainerMounted) {
    EventManager.emit(ACTION.SHOW, content, options);
  } else {
    queue.push({ action: ACTION.SHOW, content, options });
  }
};

export default Object.assign(
  (content, options) => emitEvent(content, mergeOptions(options)),
  {
    success: (content, options) => emitEvent(content, Object.assign(mergeOptions(options), { type: TYPE.SUCCESS })),
    info: (content, options) => emitEvent(content, Object.assign(mergeOptions(options), { type: TYPE.INFO })),
    warn: (content, options) => emitEvent(content, Object.assign(mergeOptions(options), { type: TYPE.WARNING })),
    error: (content, options) => emitEvent(content, Object.assign(mergeOptions(options), { type: TYPE.ERROR })),
    dismiss: () => EventManager.emit(ACTION.CLEAR)
  },
  {
    POSITION,
    TYPE
  }
);
