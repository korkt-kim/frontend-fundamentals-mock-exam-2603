# 추상화 개선 및 useSuspenseQuery 전환 계획

현재 `ReservationStatusPage` 컴포넌트는 UI 렌더링 로직과 데이터 페칭 로직(React Query)이 강하게 결합되어 있습니다. 또한 `@suspensive/react-query`의 `useSuspenseQueries`가 deprecated 됨에 따라 이를 `@tanstack/react-query`의 `useSuspenseQuery`로 전환해야 합니다. 

이 두 가지 문제를 동시에 해결하기 위해 **커스텀 훅(Custom Hooks) 계층을 도입하여 추상화 수준을 높이는 계획**입니다.

## 1. 목표 (Goals)
- **데이터 페칭 로직 분리**: UI 컴포넌트가 `queryKey`나 `queryFn` 같은 React Query의 세부 구현을 모르게 합니다.
- **useSuspenseQuery 적용**: deprecated된 API를 걷어내고 공식 API를 사용하여 안정성을 확보합니다.
- **상태 관리 최적화 (`react-hook-form`)**: `FormProvider`를 활용하여 날짜 정보를 전역적으로 공유하고, 하위 컴포넌트들이 선언적으로 상태를 구독하게 합니다.
- **런타임 안정성 확보**: URL 쿼리 파라미터(`date`)의 유효성을 엄격히 검증하여 비정상적인 입력(예: `2026-03-223333`)에 대응합니다.
- **고도화된 추상화 (Hooks & Render Props)**: 단순 Query 호출 외에도 복잡한 UI 로직을 훅으로 캡슐화하고, 재사용성이 높은 컴포넌트에는 Render Props 패턴을 적용하여 유연성을 확보합니다.

---

## 2. 세부 실행 계획

### 단계 1: 쿼리 파라미터 검증 및 초기화
- **검증 로직**: `YYYY-MM-DD` 정규식 및 실제 날짜 유효성을 체크하는 유틸리티를 도입합니다.
- **Fallback 처리**: 잘못된 날짜 형식 진입 시, 유효한 기본값(오늘 날짜 등)으로 강제 리다이렉트하거나 상태를 초기화하여 에러를 방지합니다.

### 단계 2: 상태 관리 및 커스텀 훅 생성 (`src/hooks/`)
- **`react-hook-form` 통합**: 페이지 최상단에 `FormProvider`를 배치하고, `useFormContext`를 통해 날짜 상태를 공유합니다.
- **`useReservations` (심화)**: 훅 내부에서 `useFormContext`의 날짜를 자동으로 참조하도록 하여, 컴포넌트 호출 시 날짜를 Props로 넘길 필요가 없게 합니다.
- **`useMyReservations`**: 데이터 조회뿐 아니라 예약 취소 로직까지 캡슐화하여 반환합니다.

### 단계 3: Render Props 패턴 적용
- **목적**: 데이터 로딩 상태나 특정 도메인 로직은 유지하되, UI 표현은 상황에 따라 달라질 수 있는 구간을 식별합니다.
- **대상 후보**: `Timeline`의 각 슬롯 렌더링이나, 복잡한 리스트 아이템 렌더링 부문에 `children`이나 별도 `render` 함수를 전달받는 방식을 도입하여 UI 유연성을 높입니다.

### 단계 4: 페이지 컴포넌트 리팩토링 (`src/pages/ReservationStatusPage/index.tsx`)
UI 컴포넌트는 오직 "무엇을 그릴지"와 "어떤 훅을 쓸지"만 결정합니다.

**변경 후 구조 예시:**
```tsx
function ReservationStatusPage() {
  const methods = useForm({ defaultValues: { date: getValidDateFromUrl() } });
  
  return (
    <FormProvider {...methods}>
      <PageLayout>
        <DateFilter />
        <TimelineSection />
      </PageLayout>
    </FormProvider>
  );
}

function TimelineSection() {
  // 훅 내부에서 FormContext의 date를 자동으로 참조
  const { rooms } = useRooms();
  const { reservations } = useReservations(); 
  
  // Render Props 패턴 예시 (필요 시)
  return (
    <Timeline 
      rooms={rooms} 
      reservations={reservations}
      renderRoomRow={(room) => <CustomRoomRow room={room} />} 
    />
  );
}
```


### 단계 3: 예약하기 페이지도 일관성 맞추기 (`src/pages/RoomBookingPage/index.tsx`)
- (선택적) `RoomBookingPage` 역시 `useQuery` 대신 새로 만든 커스텀 훅을 사용하도록 맞춰주면 프로젝트 전체의 일관성이 매우 높아집니다.

---

## 3. 기대 효과
1. **관심사의 분리(Separation of Concerns)**: UI와 비즈니스 로직(API 페칭)이 명확히 분리됩니다.
2. **테스트 용이성**: API 응답을 모킹할 필요 없이 커스텀 훅 자체를 모킹(Mocking)하여 UI 테스트를 짜기 더 쉬워집니다.
3. **유지보수성**: 추후 API 스펙이나 React Query 버전이 바뀌어도 `src/hooks/` 폴더 내부만 수정하면 되므로 파급 효과(Side Effect)가 최소화됩니다.
