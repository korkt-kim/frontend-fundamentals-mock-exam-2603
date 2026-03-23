import { css } from '@emotion/react';
import { useFormContext } from 'react-hook-form';
import { Text, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ALL_EQUIPMENT } from 'utils/equipment';
import { EQUIPMENT_LABELS } from 'shared/consts';
import { BookingFormValues } from 'shared/types';

export function EquipmentSelect() {
  const { watch, setValue } = useFormContext<BookingFormValues>();
  const equipment = watch('equipment');

  return (
    <div>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        필요 장비
      </Text>
      <Spacing size={8} />
      <div
        css={css`
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        `}
      >
        {ALL_EQUIPMENT.map(eq => {
          const selected = equipment.includes(eq);
          return (
            <button
              key={eq}
              type="button"
              onClick={() => {
                const next = selected ? equipment.filter(e => e !== eq) : [...equipment, eq];
                setValue('equipment', next);
              }}
              aria-label={EQUIPMENT_LABELS[eq]}
              aria-pressed={selected}
              css={css`
                padding: 8px 16px;
                border-radius: 20px;
                border: 1px solid ${selected ? colors.blue500 : colors.grey200};
                background: ${selected ? colors.blue50 : colors.grey50};
                color: ${selected ? colors.blue600 : colors.grey700};
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s;
                &:hover {
                  border-color: ${selected ? colors.blue500 : colors.grey400};
                }
              `}
            >
              {EQUIPMENT_LABELS[eq]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
