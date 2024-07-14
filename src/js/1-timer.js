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
      iziToast.show({
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#EF4040',
      });
    } else {
      refs.startButtonEl.removeAttribute('disabled');
      userSelectedDate = selectedDates[0];
    }
  },
};

flatpickr('#datetime-picker', options);

const timer = {
  intervalId: null,

  start() {
    refs.startButtonEl.setAttribute('disabled', true);

    // if (!userSelectedDate) return;

    this.intervalId = setInterval(() => {
      const currentDate = new Date();
      const ms = userSelectedDate - currentDate;
      if (ms < 1000) this.stop();
      renderTime(ms);
    }, 1000);
  },

  stop() {
    clearInterval(this.intervalId);
  },
};

refs.startButtonEl.addEventListener('click', () => {
  timer.start();
});

function renderTime(ms) {
  const parsedTime = convertMs(ms);
  const timeWithZero = addLeadingZero(parsedTime);
  const { d, h, m, s } = timeWithZero;
  refs.daysSpanEl.textContent = d;
  refs.hoursSpanEl.textContent = h;
  refs.minutesSpanEl.textContent = m;
  refs.secondsSpanEl.textContent = s;
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

function addLeadingZero(parsedTime) {
  const { days, hours, minutes, seconds } = parsedTime;
  const d = days.toString().padStart(2, '0');
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');
  return { d, h, m, s };
}
