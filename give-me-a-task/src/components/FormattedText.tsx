import React from "react";

type FormattedTextProps = {
    text: string;
    classNames: string;
}

const FormattedText = ({ text, classNames }: FormattedTextProps) => {
    return (
        <div className={`${classNames} break-words`}>
            {text.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ))}
        </div>
    );
}

export default FormattedText;