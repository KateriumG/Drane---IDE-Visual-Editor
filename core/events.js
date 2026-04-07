const listeners = {};

export function on(event, cb) {
  (listeners[event] ||= []).push(cb);
}

export function emit(event, data) {
  (listeners[event] || []).forEach(cb => cb(data));
}