import { ChangeEvent, KeyboardEvent, useContext, useEffect, useRef, useState } from "react";
import { PopupContext } from "../context/PopupContext";

type TimerEditFormProps = {
    setTimerLength: Function;
}

const TimerEditForm = ({ setTimerLength }: TimerEditFormProps) => {
    const { showTimerEditForm, setShowTimerEditForm } = useContext(PopupContext);

    const timerEditFormRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const defaultDigits = "000000";
    const defaultDisplayText = "00h 00m 00s";
    const [displayText, setDisplayText] = useState<string>(defaultDisplayText);
    const [inputText, setInputText] = useState<string>("");
    const [digits, setDigits] = useState<string>(defaultDigits);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (inputText.length < defaultDigits.length) {
            const newInputText = inputText + e.target.value;
            console.log("Input text:", newInputText);
            setInputText(newInputText);

            updateValues(newInputText);
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const newInputText = inputText.slice(0, -1);
            console.log("Input text:", newInputText);
            setInputText(newInputText);

            updateValues(newInputText);
        }

        if (e.key === 'Enter') handleSubmitForm();
    }

    const updateValues = (newInputText: string) => {
        const newDigits = defaultDigits.slice(0, defaultDigits.length - newInputText.length) + newInputText;
        console.log("Digits", newDigits);
        setDigits(newDigits);

        setDisplayText(newDigits.slice(0, 2) + "h " + newDigits.slice(2, 4) + "m " + newDigits.slice(4, 6) + "s");
    }

    const handleSubmitForm = () => {
        console.log("Submitted digits:", timeStringToSeconds(digits));
        setTimerLength(timeStringToSeconds(digits));
        setShowTimerEditForm(false);
    }

    const timeStringToSeconds = (timeString: string): number => {
        try {
            if (timeString.length !== 6 || !/^\d{6}$/.test(timeString)) {
                throw new Error('Invalid time string format. Expected "hhmmss"');
            }

            const hours = parseInt(timeString.slice(0, 2), 10);
            const minutes = parseInt(timeString.slice(2, 4), 10);
            const seconds = parseInt(timeString.slice(4, 6), 10);

            return (hours * 3600) + (minutes * 60) + seconds;
        }
        catch (error) {
            console.log(error);
            return 0;
        }
    }

    // Automatically focus cursor on input
    useEffect(() => {
        if (showTimerEditForm && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showTimerEditForm]);

    return (
        <div
            ref={timerEditFormRef}
            className="h-full"
        >
            <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                placeholder={displayText}
                value={displayText}
                onChange={e => handleChange(e)}
                onKeyDown={e => handleKeyDown(e)}
                onBlur={handleSubmitForm} // GENIUS
                className="bg-medium flex items-center justify-center px-4 font-semibold text-md space-x-2 rounded-lg w-36 text-light h-full text-right placeholder-light"
            />
        </div>
    );
}

export default TimerEditForm;