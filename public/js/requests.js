var app = new Vue({
  el: '#content',
  data: {
    requests: [],
  },
  methods: {
    upvoteRequest: (id) => {
      const upvoteFunc = firebase.functions().httpsCallable('upvote');
      upvoteFunc({ id }).catch((err) => {
        displayError(err.message);
      });
    },
  },
  mounted() {
    const databaseRef = firebase
      .firestore()
      .collection('requests')
      .orderBy('upvotes', 'desc');
    databaseRef.onSnapshot((snapshot) => {
      let currentRequests = [];
      snapshot.forEach((document) => {
        currentRequests.push({ ...document.data(), id: document.id });
      });
      this.requests = currentRequests;
    });
  },
});
