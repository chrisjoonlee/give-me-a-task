import TextareaAutosize from 'react-textarea-autosize';
import { PiListBulletsBold as BulletListIcon } from "react-icons/pi";
import { KeyboardEvent, useRef, useState } from 'react';

type RichTextEditorProps = {
    field?: Object;
    state: string;
    setState: Function;
    minRows?: number;
    maxRows?: number;
    placeholder?: string;
    textAreaClassNames?: string;
    containerClassNames?: string;
    styleMenuClassNames?: string;
}

const RichTextEditor = ({
    field = {},
    state,
    setState,
    minRows = 1,
    maxRows = 3,
    placeholder = "",
    textAreaClassNames = "",
    containerClassNames = "",
    styleMenuClassNames = ""
}: RichTextEditorProps) => {
    const bullet = '• ';
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [listMode, setListMode] = useState<string>("");

    const isBulleted = (string: string): boolean => {
        if (string.length < 2) return false;
        return string.slice(0, 2) === bullet;
    }

    const handleBulletList = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const { selectionStart, selectionEnd } = textarea;

            const valueBefore = state.slice(0, selectionStart);
            const linesBefore = valueBefore.split('\n');
            const previousLines = linesBefore.slice(0, -1).join('\n');
            const lastLine = linesBefore[linesBefore.length - 1];

            const valueAfter = state.slice(selectionEnd);
            const linesAfter = valueAfter.split('\n');
            const nextLines = linesAfter.slice(1).join('\n');
            const nextLine = linesAfter[0];

            if (selectionStart === selectionEnd) {
                const currentLine = lastLine + nextLine;

                if (isBulleted(currentLine)) removeBullet(textarea, previousLines, currentLine, nextLines, selectionStart);
                else addBullet(textarea, previousLines, currentLine, nextLines, selectionStart);
            }
            // Highlighted selection
            else {

                const selection = state.slice(selectionStart, selectionEnd);
                const selectedLines = selection.split('\n');

                let newValue = "";
                if (previousLines) newValue += previousLines + '\n';

                if (selectedLines.length === 1) {
                    const selectedLine = lastLine + selection + nextLine;
                    if (isBulleted(selectedLine)) {
                        newValue += selectedLine.slice(2);
                        setListMode("");
                    }
                    else {
                        newValue += bullet + selectedLine;
                        setListMode("bullet");
                    }
                }
                else {
                    let newMode = "";
                    const firstSelectedLine = lastLine + selectedLines[0];
                    if (!isBulleted(firstSelectedLine)) {
                        newMode = "bullet";
                        newValue += bullet;
                    }
                    newValue += firstSelectedLine;

                    if (selectedLines.length > 2) {
                        for (let i = 1; i < selectedLines.length - 1; i++) {
                            newValue += '\n';
                            if (!isBulleted(selectedLines[i])) {
                                newMode = "bullet";
                                newValue += bullet;
                            }
                            newValue += selectedLines[i];
                        }
                    }
                    const lastSelectedLine = selectedLines[selectedLines.length - 1] + nextLine;
                    newValue += '\n';
                    if (!isBulleted(lastSelectedLine)) {
                        newMode = "bullet";
                        newValue += bullet;
                    }
                    newValue += lastSelectedLine;

                    setListMode(newMode);
                }

                if (nextLines) newValue += '\n' + nextLines;

                setState(newValue);
            }
        }
    }

    const addBullet = (textarea: HTMLTextAreaElement, previousLines: string, currentLine: string, nextLines: string, selectionStart: number) => {
        setListMode("bullet");

        let newValue = "";
        if (previousLines) newValue += previousLines + '\n';
        newValue += bullet + currentLine;
        if (nextLines) newValue += '\n' + nextLines;
        setState(newValue);

        // Set cursor position
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + bullet.length + 1;
            textarea.focus();
        }, 0);
    }

    const removeBullet = (textarea: HTMLTextAreaElement, previousLines: string, currentLine: string, nextLines: string, selectionStart: number) => {
        setListMode("");

        console.log("HEY CUrrent line:", currentLine.slice(2));

        let newValue = "";
        if (previousLines) newValue += previousLines + '\n';
        newValue += currentLine.slice(2);
        if (nextLines) newValue += '\n' + nextLines;
        setState(newValue);

        // Set cursor position
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart - bullet.length;
            textarea.focus();
        }, 0);
    }

    const handleCursorChange = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const { selectionStart, selectionEnd } = textarea;
            const valueBefore: string = state.slice(0, selectionStart);
            const linesBefore = valueBefore.split('\n');
            const lastLine = linesBefore[linesBefore.length - 1];

            const valueAfter: string = state.slice(selectionEnd);
            const linesAfter = valueAfter.split('\n');
            const nextLine = linesAfter[0];

            const currentLine = lastLine + nextLine;

            if (isBulleted(currentLine)) setListMode("bullet");
            else setListMode("");
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (listMode === "bullet") {

            // Handle enter
            if (e.key === 'Enter') {
                e.preventDefault();

                const textarea = textareaRef.current;
                if (textarea) {
                    const { selectionStart, selectionEnd } = textarea;
                    const valueBefore: string = state.slice(0, selectionStart);
                    const linesBefore = valueBefore.split('\n');
                    const previousLines = linesBefore.slice(0, -1).join('\n');
                    const lastLine = linesBefore[linesBefore.length - 1];

                    const valueAfter: string = state.slice(selectionEnd);
                    const linesAfter = valueAfter.split('\n');
                    const nextLines = linesAfter.slice(1).join('\n');
                    const nextLine = linesAfter[0];

                    const currentLine = lastLine + nextLine;
                    const isEmptyBullet = currentLine === bullet;

                    if (isEmptyBullet) {
                        removeBullet(textarea, previousLines, currentLine, nextLines, selectionStart);
                        setListMode("");
                    }
                    else if (isBulleted(currentLine)) addBullet(textarea, valueBefore, nextLine, nextLines, selectionStart);
                }
            }
            // Handle delete
            else if (e.key === 'Delete' || e.key === 'Backspace') {

            }
        }
    };

    return (
        <div className={`flex flex-col ${containerClassNames}`}>

            {/* Style menu */}
            <div className={`flex items-center justify-center rounded-t-lg ${styleMenuClassNames}`}>
                <div
                    onClick={handleBulletList}
                    className={`border-opacity-70 px-2 hover:bg-gray-600 cursor-pointer transition-colors
                        ${listMode === "bullet" && "bg-gray-700"}`}
                >
                    <BulletListIcon size={18} />
                </div>
            </div>

            {/* Input */}
            <TextareaAutosize
                {...field}
                ref={textareaRef}
                value={state}
                onChange={e => setState(e.target.value)}
                onKeyDown={handleKeyDown}
                onSelect={handleCursorChange}
                minRows={minRows}
                maxRows={maxRows}
                placeholder={placeholder}
                className={textAreaClassNames}
            />
        </div>
    );
}

export default RichTextEditor;