import { css } from '@emotion/react';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { useForm } from 'lib/useForm';

import { Top, Spacing, Border, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getValidDate } from 'utils/date';
import { Message } from 'shared/components/Message';
import { DateFilterSection } from 'features/reservationStatus/components/DateFilterSection';
import { TimelineSection } from 'features/reservationStatus/components/TimelineSection';
import { MyReservationsSection } from 'features/reservationStatus/components/MyReservationsSection';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const methods = useForm({
    defaultValues: {
      date: getValidDate(searchParams.get('date')),
    },
    searchParamSync: true,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setMessage({ type: 'success', text: state.message });
      // 메시지 표시 후 상태 초기화 (뒤로가기/새로고침 시 중복 방지)
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, location.search, navigate]);

  return (
    <FormProvider {...methods}>
      <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
        <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
          회의실 예약
        </Top.Top03>

        <Spacing size={24} />

        {/* 날짜 선택 */}
        <DateFilterSection />

        <Spacing size={24} />
        <Border size={8} />
        <Spacing size={24} />

        {/* 예약 현황 타임라인 */}
        <Suspense fallback={<div css={css`padding: 0 24px; height: 200px; background: ${colors.grey50}; border-radius: 14px; margin: 0 24px;`} />}>
          <TimelineSection />
        </Suspense>

        <Spacing size={24} />
        <Border size={8} />
        <Spacing size={24} />

        {/* 메시지 배너 */}
        {message && (
          <Message
            message={message.text}
            messageColor={message.type === 'success' ? colors.blue600 : colors.red500}
            innerCss={css`
              background: ${message.type === 'success' ? colors.blue50 : colors.red50};
            `}
            css={css`
              padding-bottom: 12px;
            `}
          />
        )}

        {/* 내 예약 목록 */}
        <Suspense fallback={<div css={css`padding: 0 24px; height: 100px; background: ${colors.grey50}; border-radius: 14px; margin: 0 24px;`} />}>
          <MyReservationsSection setMessage={setMessage} />
        </Suspense>

        <Spacing size={24} />
        <Border size={8} />
        <Spacing size={24} />

        {/* 예약하기 버튼 */}
        <div css={css`padding: 0 24px;`}>
          <Button display="full" onClick={() => navigate('/booking')}>
            예약하기
          </Button>
        </div>
        <Spacing size={24} />
      </div>
    </FormProvider>
  );
}
