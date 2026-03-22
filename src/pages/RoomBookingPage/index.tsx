import { css } from '@emotion/react';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FormProvider, useFormContext } from 'react-hook-form';
import { useForm } from 'lib/useForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';

import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getValidDate } from 'utils/date';
import { getValidEquipment } from 'utils/equipment';
import { createReservation } from 'pages/remotes';
import { useRooms } from 'queries/rooms';
import { Reservation } from '_tosslib/server/types';
import { BookingFormValues } from 'shared/types';
import { Message } from 'shared/components/Message';

import { BookingFormSection } from 'features/booking/components/BookingFormSection';
import { AvailableRoomListSection } from 'features/booking/components/AvailableRoomListSection';
import { useAvailableRooms } from 'features/booking/hooks/useAvailableRooms';

export function RoomBookingPage() {
  const [searchParams] = useSearchParams();

  const methods = useForm<BookingFormValues>({
    mode: 'onChange',
    defaultValues: {
      roomId: null,
      date: getValidDate(searchParams.get('date')),
      startTime: searchParams.get('startTime') || '',
      endTime: searchParams.get('endTime') || '',
      attendees: Number(searchParams.get('attendees')) || 1,
      equipment: getValidEquipment(searchParams.get('equipment')),
      floor: searchParams.get('floor') || '',
    },
    searchParamSync: true,
  });

  return (
    <FormProvider {...methods}>
      <Suspense fallback={<div css={css`padding: 0 24px; height: 200px; background: ${colors.grey50}; border-radius: 14px; margin: 0 24px;`} />}>
        <RoomBookingPageContent />
      </Suspense>
    </FormProvider>
  );
}

function RoomBookingPageContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { rooms } = useRooms();
  const { isFilterComplete, validationError, formValues } = useAvailableRooms();
  const { setValue, setError, clearErrors, formState: { errors } } = useFormContext<BookingFormValues>();

  const setSelectedRoomId = (id: string | null) => {
    setValue('roomId', id, { shouldValidate: true });
    clearErrors('root.serverError');
  };

  const errorMessage = errors.root?.serverError?.message || errors.roomId?.message;

  const createMutation = useMutation(
    (data: Omit<Reservation, 'id'>) => createReservation(data),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries(['reservations', variables.date]);
        queryClient.invalidateQueries(['myReservations']);
      },
    }
  );

  // 필터 변경 시 선택 초기화
  useEffect(() => {
    setSelectedRoomId(null);
  }, [formValues.date, formValues.startTime, formValues.endTime, formValues.attendees, formValues.equipment, formValues.floor, clearErrors]);

  const floors = [...new Set(rooms.map((r) => r.floor))].sort((a: number, b: number) => a - b);

  const handleBook = async () => {
    const { roomId } = formValues;
    if (!roomId) {
      setError('roomId', { type: 'manual', message: '회의실을 선택해주세요.' });
      return;
    }
    if (!formValues.startTime || !formValues.endTime) {
      setError('root.serverError', { type: 'manual', message: '시작 시간과 종료 시간을 선택해주세요.' });
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId,
        date: formValues.date!,
        start: formValues.startTime!,
        end: formValues.endTime!,
        attendees: formValues.attendees!,
        equipment: formValues.equipment!,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      setError('root.serverError', { type: 'manual', message: errResult.message ?? '예약에 실패했습니다.' });
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setError('root.serverError', { type: 'manual', message: serverMessage });
      setSelectedRoomId(null);
    }
  };

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <div css={css`padding: 12px 24px 0;`}>
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none; border: none; padding: 0; cursor: pointer; font-size: 14px;
            color: ${colors.grey600}; &:hover { color: ${colors.grey900}; }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        예약하기
      </Top.Top03>

      {errorMessage && (
        <Message
          message={errorMessage}
          messageColor={colors.red500}
          innerCss={css`
            background: ${colors.red50};
          `}
          css={css`
            padding-top: 12px;
          `}
        />
      )}

      <Spacing size={24} />

      {/* 예약 조건 입력 */}
      <div css={css`padding: 0 24px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 조건
        </Text>
        <Spacing size={16} />
        <BookingFormSection floors={floors} />
      </div>

      {validationError && (
        <Message
          message={validationError}
          messageColor={colors.red500}
          css={css`
            padding-top: 8px;
          `}
        />
      )}

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 가능 회의실 목록 */}
      <Suspense fallback={<div css={css`padding: 0 24px; height: 200px; background: ${colors.grey50}; border-radius: 14px; margin: 0 24px;`} />}>
        <AvailableRoomListSection 
          selectedRoomId={formValues.roomId}
          onSelect={setSelectedRoomId}
        />
      </Suspense>

      <div css={css`padding: 16px 24px 0;`}>
        <Button display="full" onClick={handleBook} disabled={createMutation.isLoading}>
          {createMutation.isLoading ? '예약 중...' : '확정'}
        </Button>
      </div>

      <Spacing size={24} />
    </div>
  );
}
