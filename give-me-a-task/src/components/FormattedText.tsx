import React from "react";
import Linkify from 'react-linkify';

type FormattedTextProps = {
    text: string;
    classNames: string;
}

const FormattedText = ({ text, classNames }: FormattedTextProps) => {
    const linkDecorator = (href: string, text: string, key: number) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    );


    return (
        <div className={`${classNames} break-words`}>
            <Linkify componentDecorator={linkDecorator}>
                {text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
            </Linkify>
        </div>
    );
}

export default FormattedText;