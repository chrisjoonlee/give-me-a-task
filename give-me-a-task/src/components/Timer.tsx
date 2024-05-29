import { useTimer } from 'react-timer-hook';
import { FaPlay as PlayIcon } from "react-icons/fa";
import { FaPause as PauseIcon } from "react-icons/fa6";
import { FaUndo as RestartIcon } from "react-icons/fa";
import useSound from 'use-sound';
import alarmSound from '../assets/timerAlarm.mp3';

const Timer = () => {
    const timerLength = 5; // In seconds
    // const alarmSound = new Audio('');

    const time = new Date();
    time.setSeconds(time.getSeconds() + timerLength);

    const [playAlarm, { stop: stopAlarm }] = useSound(alarmSound);

    const {
        seconds,
        totalSeconds,
        minutes,
        hours,
        isRunning,
        start,
        pause,
        restart,
    } = useTimer({
        expiryTimestamp: time,
        onExpire: () => {
            console.log("Timer up");
            playAlarm();
        },
        autoStart: false
    });

    const numberClassNames = "text-xl";
    const buttonClassNames = "h-full px-4 py-2 text-light hover:bg-medium transition-colors";

    const handleRestart = () => {
        stopAlarm();

        const time = new Date();
        time.setSeconds(time.getSeconds() + timerLength);
        restart(time);
        pause();
    }

    return (
        <div className="flex flex-col bg-dark p-3 rounded-lg space-y-3 pb-5">
            {/* Title */}
            <h1 className="text-lg font-bold text-light mx-auto">
                Timer
            </h1>

            {/* Timer */}
            <div className="flex space-x-3 justify-center h-12">
                {/* Time display */}
                <div className="bg-medium flex items-center justify-center px-4 font-semibold text-md space-x-2 rounded-lg w-36 text-light">
                    {/* Hours */}
                    {hours > 0 && (
                        <span>
                            <span className={numberClassNames}>{hours}</span>h
                        </span>
                    )}

                    {/* Minutes */}
                    <span>
                        <span className={numberClassNames}>{minutes}</span>m
                    </span>

                    {/* Seconds */}
                    <span>
                        <span className={numberClassNames}>{seconds}</span>s
                    </span>
                </div>

                {/* Buttons */}
                <div className="space-x-3">
                    {/* Play / Pause */}

                    {totalSeconds > 0 ?
                        <button
                            onClick={isRunning ? pause : start}
                            className={`${buttonClassNames} bg-gray-700`}
                        >
                            {isRunning ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                        </button>
                        :
                        <button
                            className={`${buttonClassNames} bg-medium`}
                            disabled
                        >
                            <PlayIcon size={16} />
                        </button>
                    }

                    {/* Restart */}
                    <button onClick={handleRestart}
                        className={`${buttonClassNames} bg-gray-700`}
                    >
                        <RestartIcon size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Timer;