class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  off(eventName, listenerToRemove) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(
      listener => listener !== listenerToRemove
    );
  }
  
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(listener => {
        listener(...args);
      });
    }
  } 
}

/*

const myEmitter = new EventEmitter();

const greetListener = (name) => console.log(`Hello, ${name}!`);
const farewellListener = (name) => console.log(`Goodbye, ${name}.`);

myEmitter.on('greet', greetListener);
myEmitter.on('farewell', farewellListener);
myEmitter.on('greet', (name) => console.log(`Nice to see you, ${name}.`));

myEmitter.emit('greet', 'Alice');
myEmitter.emit('farewell', 'Bob');

myEmitter.off('greet', greetListener);

*/
