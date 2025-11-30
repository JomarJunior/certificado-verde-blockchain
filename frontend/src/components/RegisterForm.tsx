import { Checkbox, FormControl, FormControlLabel, InputAdornment, MenuItem, Radio, RadioGroup, Select, Stack, TextField } from "@mui/material";
import React from "react";

/**
 * A Value can be:
 *      - string: for text inputs
 *      - number: for numeric inputs
 *      - boolean: for checkbox inputs
 *      - readonly string[]: for multi-select inputs
 */
export type ValueType = string | number | boolean | readonly string[];

export type FormType = 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'password' | 'radio';

export interface RegisterFormField<target extends object> {
    label: string;
    field: keyof target;
    type: FormType;
    placeholder?: string;
    defaultValue?: ValueType;
    items?: { label: string; value: ValueType }[]; // For select type
    required?: boolean;
    icon?: React.ReactNode;
    multiple?: boolean; // For select type
    validation?: (value: ValueType) => string | null; // Returns error message or null if valid
}

interface RegisterFormProps<T extends object> {
    target: T;
    fields: RegisterFormField<T>[];
    onChange: (field: keyof T, value: ValueType) => void;
}

const getFieldComponent = <T extends object>(
    fieldDef: RegisterFormField<T>,
    value: ValueType,
    onChange: (value: ValueType) => void,
    validationError?: string
) => {
    const fieldType = fieldDef.type;
    const fieldMap: Record<string, React.ReactNode> = {
        text: (
            <FormControlLabel
                control={
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={value as string ?? fieldDef.defaultValue ?? ''}
                        placeholder={fieldDef.placeholder}
                        error={Boolean(validationError)}
                        helperText={validationError}
                        onChange={(e) => onChange(e.target.value)}
                    />
                }
                label={(
                    <span>{fieldDef.icon} {fieldDef.label}</span>
                )}
                labelPlacement="top"
            />
        ),
        number: (
            <FormControlLabel
                control={
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={value as number ?? fieldDef.defaultValue ?? 0}
                        placeholder={fieldDef.placeholder}
                        error={Boolean(validationError)}
                        helperText={validationError}
                        onChange={(e) => onChange(Number(e.target.value))}
                    />
                }
                label={
                    (<span>{fieldDef.icon} {fieldDef.label}</span>)
                }
                labelPlacement="top"
            />
        ),
        textarea: (
            <FormControlLabel
                control={
                    <TextField
                        fullWidth
                        variant="outlined"
                        multiline
                        minRows={3}
                        value={value as string ?? fieldDef.defaultValue ?? ''}
                        label={fieldDef.label}
                        placeholder={fieldDef.placeholder}
                        slotProps={{
                            input: {
                                startAdornment: fieldDef.icon ? (
                                    <InputAdornment position="start">
                                        {fieldDef.icon}
                                    </InputAdornment>
                                ) : undefined
                            }
                        }}
                        sx={{
                            '& .MuiInputBase-input': {
                                overflow: 'hidden',
                                maxHeight: '150px',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'pre-wrap',
                            }
                        }}
                        error={Boolean(validationError)}
                        helperText={validationError}
                        onChange={(e) => onChange(e.target.value)}
                    />
                }
                label={(
                    <span>{fieldDef.icon} {fieldDef.label}</span>
                )}
                labelPlacement="top"
            />
        ),
        select: (
            <FormControlLabel
                control={
                    <Select
                        fullWidth
                        value={value as string | number | boolean ?? fieldDef.defaultValue ?? ''}
                        multiple={fieldDef.multiple ?? false}
                        onChange={(e) => onChange(e.target.value as string | number | boolean)}
                        error={Boolean(validationError)}
                    >
                        {fieldDef.items?.map((item) => (
                            <MenuItem key={String(item.value)} value={String(item.value)}>
                                {item.label}
                            </MenuItem>
                        ))}
                    </Select>
                }
                label={(
                    <span>{fieldDef.icon} {fieldDef.label}</span>
                )}
                labelPlacement="top"
            />
        ),
        checkbox: (
            <FormControlLabel
                control={
                    <Checkbox
                        value={value as boolean ?? fieldDef.defaultValue ?? false}
                        checked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                }
                label={fieldDef.label}
            />
        ),
        radio: (
            <FormControlLabel
                control={
                    <RadioGroup
                        value={value as string ?? fieldDef.defaultValue ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        {fieldDef.items?.map((item) => (
                            <FormControlLabel
                                key={String(item.value)}
                                value={String(item.value)}
                                control={<Radio />}
                                label={item.label}
                            />
                        ))}
                    </RadioGroup>
                }
                label={fieldDef.label}
            />
        ),
        password: (
            <FormControlLabel
                control={
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="password"
                        value={value as string ?? fieldDef.defaultValue ?? ''}
                        label={fieldDef.label}
                        placeholder={fieldDef.placeholder}
                        slotProps={{
                            input: {
                                startAdornment: fieldDef.icon ? (
                                    <InputAdornment position="start">
                                        {fieldDef.icon}
                                    </InputAdornment>
                                ) : undefined
                            }
                        }}
                        onChange={(e) => onChange(e.target.value)}
                    />
                }
                label={(
                    <span>{fieldDef.icon} {fieldDef.label}</span>
                )}
                labelPlacement="top"
            />
        ),
    };

    return fieldMap[fieldType] || null;
}

export default function RegisterForm<T extends object>(
    {
        target,
        fields,
        onChange,
    }: RegisterFormProps<T>
) {
    const [errors, setErrors] = React.useState<Record<keyof T, string | undefined>>({} as Record<keyof T, string | undefined>);

    const validateField = (fieldDef: RegisterFormField<T>, value: ValueType): string | undefined => {
        if (fieldDef.required) {
            if (value === null || value === undefined || value === '') {
                return 'Este campo é obrigatório.';
            }
        }
        if (fieldDef.validation) {
            return fieldDef.validation(value) || undefined;
        }
        return undefined;
    }

    const handleFieldChange = (fieldDef: RegisterFormField<T>, value: ValueType) => {
        const error = validateField(fieldDef, value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldDef.field]: error,
        }));
        onChange(fieldDef.field, value);
    }

    return (
        <Stack spacing={1} sx={{ mt: 2 }}>
            {fields.map((fieldDef) => {
                let value = target[fieldDef.field] as ValueType;

                if (fieldDef.multiple && Array.isArray(value)) {
                    value = value.map((v: { name: string }) => v.name) as readonly string[];
                }

                return (
                    <FormControl key={String(fieldDef.field)} fullWidth error={Boolean(errors[fieldDef.field])}>
                        {getFieldComponent(
                            fieldDef,
                            value,
                            (newValue) => handleFieldChange(fieldDef, newValue as ValueType),
                            errors[fieldDef.field])
                        }
                    </FormControl>
                );
            })}
        </Stack>
    );

};
