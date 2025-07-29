const userHandler = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (typeof value !== 'number' || value <= 0) {
        throw new Error('Age must be a positive number.');
      }
    }
    obj[prop] = value;
    return true;
  }
};

const user = new Proxy({}, userHandler);

try {
  user.name = 'John Doe';
  user.age = 30;
  console.log(user); // Output: { name: 'John Doe', age: 30 }

  user.age = -5; // This will throw an error
} catch (e) {
  console.error(e.message);
}

try {
  user.age = 'twenty'; // This will also throw an error
} catch (e) {
  console.error(e.message);
}
