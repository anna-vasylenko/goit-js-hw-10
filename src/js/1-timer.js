import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  dateTimePickerEl: document.querySelector('#datetime-picker'),
  startButtonEl: document.querySelector('[data-start]'),
  daysSpanEl: document.querySelector('[data-days]'),
  hoursSpanEl: document.querySelector('[data-hours]'),
  minutesSpanEl: document.querySelector('[data-minutes]'),
  secondsSpanEl: document.querySelector('[data-seconds]'),
};

let userSelectedDate;
refs.startButtonEl.setAttribute('disabled', true);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      refs.startButtonEl.setAttribute('disabled', true);
      iziToast.show({
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#EF4040',
        messageColor: '#fff',
        progressBarColor: '#fff',
      });
    } else {
      refs.startButtonEl.removeAttribute('disabled');
      userSelectedDate = selectedDates[0];
    }
  },
};

flatpickr('#datetime-picker', options);

function onBtnTimerStart() {
  if (userSelectedDate < new Date()) {
    refs.startButtonEl.setAttribute('disabled', true);
    return;
  }
  refs.startButtonEl.setAttribute('disabled', true);
  refs.dateTimePickerEl.setAttribute('disabled', true);

  const intervalId = setInterval(() => {
    const currentDate = new Date();
    const ms = userSelectedDate - currentDate;

    if (ms < 1000) {
      clearInterval(intervalId);
      refs.dateTimePickerEl.removeAttribute('disabled');
    }

    renderTime(ms);
  }, 1000);
}

refs.startButtonEl.addEventListener('click', onBtnTimerStart);

function renderTime(ms) {
  const parsedTime = convertMs(ms);
  const { days, hours, minutes, seconds } = parsedTime;

  refs.daysSpanEl.textContent = days.toString().padStart(2, '0');
  refs.hoursSpanEl.textContent = hours.toString().padStart(2, '0');
  refs.minutesSpanEl.textContent = minutes.toString().padStart(2, '0');
  refs.secondsSpanEl.textContent = seconds.toString().padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}
