

// // src/app/hooks/contest/useContestTimer.ts
// import { useState, useEffect } from 'react';
// import { Contest } from '../../../types/contest';

// export const useContestTimer = (activeContest) => {
//   const [timeLeft, setTimeLeft] = useState('');

//   useEffect(() => {
//     if (activeContest.length > 0 && activeContest[0].state === 'active') {
//       const timer = setInterval(() => {
//         const now = new Date().getTime();
//         const endTime = new Date(activeContest[0].endTime).getTime();
//         const difference = endTime - now;

//         if (difference > 0) {
//           const hours = Math.floor(difference / (1000 * 60 * 60));
//           const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//           const seconds = Math.floor((difference % (1000 * 60)) / 1000);
//           setTimeLeft(
//             `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
//           );
//         } else {
//           setTimeLeft('Contest Ended');
//           clearInterval(timer);
//         }
//       }, 1000);

//       return () => clearInterval(timer);
//     }
//   }, [activeContest]);

//   return timeLeft;
// };




// src/app/hooks/contest/useContestTimer.ts
import { useState, useEffect } from 'react';
import { ContestState } from '../../../types/contest-info';





export const useContestTimer = (contest) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!contest) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const targetDate =
      contest.state === ContestState.UPCOMING || contest.state === ContestState.REGISTRATION_OPEN
        ? contest.startTime
        : contest.endTime;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  return timeLeft;
};