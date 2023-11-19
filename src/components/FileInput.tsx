import React, {FC} from 'react';
import {DownloadIcon} from "./icons/DownloadIcon";
import '../index.scss';

type TFileInputProps = {
    text?: string,
    onInput: (e: React.FormEvent<HTMLInputElement>) => void,
}

const FileInput: FC<TFileInputProps> = ({text, onInput}) => {
    return (
        <div className="input__wrapper">
            <input
                name="file"
                type="file"
                id="input__file"
                className="input input__file"
                onInput={onInput}
            />
            <label htmlFor="input__file" className="input__file-button">
                <span className="input__file-button-text">
                    {text ?? 'Выбрать файл'}
                    <DownloadIcon />
                </span>
            </label>
        </div>
    );
};

export default FileInput;