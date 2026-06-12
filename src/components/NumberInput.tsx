import { useState, useEffect } from 'react';

interface NumberInputProps {
    /** 数值（由父组件管理） */
    value: number;
    /** 当用户输入合法数字时回调；空字符串会被转换为 0 */
    onChange: (n: number) => void;
    id?: string;
    className?: string;
    disabled?: boolean;
    placeholder?: string;
    /** 可选：超过此值时是否自动夹紧到最大值（仅在 onChange 阶段生效） */
    max?: number;
    /** 可选：低于此值时是否自动夹紧到最小值（仅在 onChange 阶段生效） */
    min?: number;
}

/**
 * 数字输入框，内部以字符串 state 持有输入值，避免
 *  `parseInt("") || 0` 把"空"夹回 0 导致最后一位 0 删不掉的问题。
 *
 * - type="text" + inputMode="numeric"：移动端弹数字键盘
 * - 正则 `/^\d*$/` 校验：仅允许空串或纯数字字符
 * - 通过 useEffect 与外部 value 同步，外部重置时输入框也会同步刷新
 */
export function NumberInput({
    value,
    onChange,
    id,
    className,
    disabled,
    placeholder,
    max,
    min,
}: NumberInputProps) {
    const [text, setText] = useState<string>(String(value));

    useEffect(() => {
        setText(String(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        // 仅放行空串或纯数字；其它字符（含负号、小数点、字母）一律忽略
        if (v !== '' && !/^\d+$/.test(v)) {
            return;
        }
        setText(v);
        if (v === '') {
            onChange(0);
            return;
        }
        let n = parseInt(v, 10);
        if (Number.isNaN(n)) {
            onChange(0);
            return;
        }
        if (typeof min === 'number' && n < min) n = min;
        if (typeof max === 'number' && n > max) n = max;
        onChange(n);
    };

    return (
        <input
            id={id}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={text}
            onChange={handleChange}
            disabled={disabled}
            placeholder={placeholder}
            className={className}
        />
    );
}
