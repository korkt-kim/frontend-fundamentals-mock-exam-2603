import { css } from '@emotion/react';
import { Controller, useFormContext } from 'react-hook-form';
import { colors } from '_tosslib/constants/colors';
import { getValidDate } from 'utils/date';

interface Props {
  name: string;
}

export function DatePicker({ name }: Props) {
  const { control } = useFormContext();
  const today = getValidDate(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          type="date"
          min={today}
          aria-label="날짜"
          css={css`
            box-sizing: border-box;
            font-size: 16px;
            font-weight: 500;
            line-height: 1.5;
            height: 48px;
            background-color: ${colors.grey50};
            border-radius: 12px;
            color: ${colors.grey800};
            width: 100%;
            border: 1px solid ${colors.grey200};
            padding: 0 16px;
            outline: none;
            transition: border-color 0.15s;
            &:focus {
              border-color: ${colors.blue500};
            }
          `}
        />
      )}
    />
  );
}
