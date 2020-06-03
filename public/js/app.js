const RequestLink = document.querySelector('.add-request');
const RequestModal = document.querySelector('.new-request');
const requestForm = document.querySelector('.new-request form');

RequestLink.addEventListener('click', () => {
  RequestModal.classList.add('open');
});

RequestModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('new-request')) {
    RequestModal.classList.remove('open');
  }
});

// add a new request
requestForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const addRequest = firebase.functions().httpsCallable('addRequest');
  addRequest({
    text: requestForm.request.value,
  })
    .then(() => {
      requestForm.reset();
      requestForm.querySelector('.error').textContent = '';
      RequestModal.classList.remove('open');
    })
    .catch((error) => {
      if (error.message == 'INTERNAL') {
        RequestModal.classList.remove('open');
        requestForm.querySelector('.error').textContent = '';
      }
      if (error.message === 'INTERNAL') {
        displayError('Firebase Server down..Please Try Again Later..');
      } else {
        displayError(error.message);
      }
    });
});

const notification = document.querySelector('.notification');

const displayError = (msg) => {
  notification.textContent = msg;
  notification.classList.add('active');
  setTimeout(() => {
    notification.classList.remove('active');
    notification.textContent = '';
  }, 4000);
};
