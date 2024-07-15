import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  formEl: document.querySelector('.form'),
};

refs.formEl.addEventListener('submit', e => {
  e.preventDefault();

  const delay = +refs.formEl.elements.delay.value;
  if (delay < 0) return;

  createPromise(delay)
    .then(delay =>
      iziToast.success({
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        messageColor: '#fff',
        progressBarColor: '#fff',
        backgroundColor: '#59a10d',
      })
    )
    .catch(delay =>
      iziToast.error({
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
        iconColor: '#fff',
        progressBarColor: '#fff',
        backgroundColor: '#ef4040',
      })
    )
    .finally(() => {
      refs.formEl.elements.delay.value = '';
      const radioButtons = refs.formEl.elements.state;
      for (let i = 0; i < radioButtons.length; i++) {
        radioButtons[i].checked = false;
      }
    });
});

function createPromise(delay) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (refs.formEl.elements.state.value === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
  return promise;
}
