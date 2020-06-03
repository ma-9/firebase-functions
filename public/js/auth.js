// Reference of Links
const RegisterLinks = document.querySelectorAll('.switch');
const AuthDiv = document.querySelector('.auth');
const AuthModal = document.querySelectorAll('.auth .modal');
const RegisterForm = document.querySelector('.register');
const LoginForm = document.querySelector('.login');
const SignOutButton = document.querySelector('.sign-out');

// Toggle the links
RegisterLinks.forEach((links) => {
  links.addEventListener('click', () => {
    AuthModal.forEach((modal) => modal.classList.toggle('active'));
  });
});

// Registeration Form
RegisterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const Email = RegisterForm.email.value;
  const Password = RegisterForm.password.value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(Email, Password)
    .then((user) => {
      console.log(`Registered User...`, user);
      RegisterForm.reset();
    })
    .catch((err) => {
      displayError(err.message);
    });
});

// Login Form
LoginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const Email = LoginForm.email.value;
  const Password = LoginForm.password.value;
  firebase
    .auth()
    .signInWithEmailAndPassword(Email, Password)
    .then((user) => {
      console.log(`Logged In User...`, user);
      LoginForm.reset();
    })
    .catch((err) => {
      displayError(err.message);
    });
});

// Sign out
SignOutButton.addEventListener('click', () => {
  SignOutButton.textContent = 'Signning Out...';
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('Signed Out...');
    });
  SignOutButton.textContent = 'Sign out';
});

// Auth Listener
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    AuthDiv.classList.remove('open');
    AuthModal.forEach((modal) => modal.classList.remove('active'));
  } else {
    AuthDiv.classList.add('open');
    AuthModal[0].classList.add('active');
  }
});
