import {FC, useState} from 'react';
import styles from '../styles/Dropdown.module.scss';
import {ArrowDownIcon} from "./icons/ArrowDownIcon";
import {ArrowUpIcon} from "./icons/ArrowUpIcon";
import {ALL} from "../helpers/constants";

type TDropdownProps = {
    value: string | null,
    options: string[],
    onSelect: (value: string) => void,
}

const Dropdown: FC<TDropdownProps> = ({value, options, onSelect}) => {
    const [isOpen, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(!isOpen);
    };

    const handleSelectCity = (option: string): void => {
        onSelect(option);
        handleOpen();
    }

    return (
        <div className={styles.dropdown}>
            <button onClick={handleOpen}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                    {value ?? 'Выберите город'}
                    {isOpen ? <ArrowUpIcon/> : <ArrowDownIcon />}
                </div>
            </button>
            {isOpen && <ul>
                <li className={styles.dropdown__item}
                    key={'all'}
                    onClick={(): void => handleSelectCity(ALL)}>{ALL}</li>
                {
                    options.map((option) => (
                        <li
                            className={styles.dropdown__item}
                            key={option}
                            onClick={(): void => handleSelectCity(option)}
                        >{option}</li>
                    ))
                }
            </ul>}
        </div>
    );
};

export default Dropdown;