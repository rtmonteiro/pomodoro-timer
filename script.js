const pomodoroTimer = document.querySelector('#pomodoro-timer');

const startButton = document.querySelector('#pomodoro-start');
const pauseButton = document.querySelector('#pomodoro-pause');
const stopButton = document.querySelector('#pomodoro-stop');

let currentTaskLabel = document.querySelector('#pomodoro-clock-task')

let type = 'Work';

let timeSpentInCurrentSession = 0;


// START
startButton.addEventListener('click', () => {
  toggleClock();
})

// PAUSE
startButton.addEventListener('click', () => {
  toggleClock();
})

// STOP
startButton.addEventListener('click', () => {
  toggleClock(true);
})

let isClockRunning = false;

// in seconds = 25 mins
let workSessionDuation = 1500;
let currentTimeLeftInSession = 1500;

// in seconds = 5 mins
let breakSessionDuration = 300;

const toggleClock = (reset) => {
  if (reset) {
    // STOP THE TIMER
    stopClock();
  } else {
    if (isClockRunning === true) {
      // PAUSE THE TIMER
      clearInterval(clockTimer);
      isClockRunning = false;
    } else {
      // START THE TIMER
      isClockRunning = true;
    }
  }
}

const stepDown = () => {
  if (currentTimeLeftInSession > 0) {
    // decrease time left / increase time spent
    currentTimeLeftInSession--;
    timeSpentInCurrentSession++;
  } else if (currentTimeLeftInSession === 0){
    timeSpentInCurrentSession = 0;
    // Timer is over -> if work switch to break, viceversa
    if (type === 'Work') {
      currentTimeLeftInSession = breakSessionDuration;
      displaySessionLog('Work');
      type = 'Break';
      // new
      currentTaskLabel.value = 'Break';
      currentTaskLabel.disabled = true;
    } else {
      currentTimeLeftInSession = workSessionDuration;
      type = 'Work';
      // new
      if (currentTaskLabel.value === 'Break') {
        currentTaskLabel.value = workSessionLabel;
      }
      currentTaskLabel.disabled = false;
      displaySessionLog('Break');
    }
  }
  displayCurrentTimeLeftInSession();
}

const displayCurrentTimeLeftInSession = () => {
  const secondsLeft = currentTimeLeftInSession;
  let result = '';
  const seconds = secondsLeft % 60;
  const minutes = parseInt(secondsLeft / 60) % 60;
  let hours = parseInt(secondsLeft / 3600);
  // add leading zeroes if it's less than 10
  function addLeadingZeroes(time) {
    return time < 10 ? `0${time}` : time;
  }
  if (hours > 0) result +=`${hours}:`
  result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
  pomodoroTimer.innerText = result.toString();
}

clockTimer = setInterval(() => {
  // decrease time left / increase time spent
  stepDown();
  displayCurrentTimeLeftInSession();
}, 1000)

const stopClock = () {
  displaySessionLog(type);
  // 1) reset the timer we set
  clearInterval(clockTimer);
  // 2) update our variable to know that the time is stopped
  isClockRunning = false;
  // reset the time left in the session to its original state
  currentTimeLeftInSession = workSessionDuation;
  // update the timer displayed
  displayCurrentTimeLeftInSession();
  // reset the time in current session
  type = 'Work';
}

const displaySessionLog = (type) => {
  const sessionList = document.querySelector('#pomodoro-sessions');
  // append li to it
  const li = document.createElement('li');
  if (type === 'Work') {
    sessionLabel = currentTaskLabel.value
      ? currentTaskLabel.value
      : 'Work';
    workSessionLabel = sessionLabel;  
  } else {
    sessionLabel = 'Break'
  }  
  let elapsedTime = parseInt(timeSpentInCurrentSession / 60);
  elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1';

  const text = document.createTextNode(
    `${sessionLabel} : ${elapsedTime} min`
  )
  li.appendChild(text);
  sessionList.appendChild(li);
}
