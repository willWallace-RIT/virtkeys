(function () {
  // 2 - `pubsub` is an object we going make global at the end of this IIFE
  // Why are we using an object literal instead of a class? Because we only need ONE instance
  const pubsub = {};
  // 3 - `topics` is a map (object literal) that stores topic names that can be broadcast or listened for
  // `topics` can also be thought of as "events" or "messages"
  // // but to keep with the Publish/Subscribe metaphor, we'll just call them `topics`
  // `topics` also stores references to "subscribers"
  // "subscribers" are blocks of code that will be executed whenever the specific topic they are "interested in" is published
  const topics = {};
  // 4 - unique identifier for each subscriber
  let subUid = -1;
  // 5- Publish or broadcast topics of interest
  // and send the specific topic name and an info object
  // In this example, the <my-list> component will be the publisher
  pubsub.publish = (topic, info) => {
    if (!topics[topic]) return false;
    const subscribers = topics[topic];
    for (const sub of subscribers) {
      sub.func(topic, info);
    }
    return this;
  };
  // 6 - Subscribe to events of interest with a specific topic name and a
  // callback function, to be executed when the topic (i.e. the event) is observed
  // sends back a unique id, which can be used to later .unsubscribe if desired,
  // similar to how `window.setInterval()` sends back an intervalId
  pubsub.subscribe = (topic, func) => {
    if (!topics[topic]) topics[topic] = [];
    const uid = ++subUid;
    topics[topic].push({ uid, func });
    return uid;
  };

  // 7 - Unsubscribe from a specific topic, using the subscription uid
  pubsub.unsubscribe = uid => {
    for (const msg of Object.keys(topics)) {
      if (topics[msg]) {
        topics[msg] = topics[msg].filter(sub => sub.uid !== uid);
      }
    }
  };
  // 8 - logs out the topics, and the subscriptions that belong to each one
  pubsub.debug = () => console.log(topics);
  // 9 - put `pubsub` into global namespace
  window.pubsub = pubsub;
}());
