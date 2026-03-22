# TanStack Query v5 vs. @suspensive/react-query

TanStack Query v5에서 `useSuspenseQuery`, `useSuspenseQueries`, `useSuspenseInfiniteQuery`가 공식 API로 포함되었습니다. 이를 통해 Suspense는 TanStack Query 내에서 **'1급 시민(First-class citizen)'**으로 대우받게 되었습니다.

---

## 1. '1급 시민(First-class citizen)'으로서의 Suspense

프로그래밍에서 어떤 개념이 '1급 시민'이라는 것은, 그 개념이 부차적인 옵션이 아니라 **프레임워크의 핵심 설계 요소로 통합되어 모든 권리를 누린다**는 뜻입니다.

### ① 전용 API의 탄생 (Dedicated Hooks)
- **v4 (2급 시민)**: `useQuery(key, fn, { suspense: true })` 처럼 기존 훅에 옵션을 살짝 끼워 넣는 방식이었습니다.
- **v5 (1급 시민)**: `useSuspenseQuery`라는 **독립적인 전용 훅**이 생겼습니다. 이는 Suspense가 더 이상 선택 사항이 아니라, 그 자체로 완결된 사용 흐름을 가진다는 것을 의미합니다.

### ② 타입 시스템의 확신 (Type Safety)
- 일반 `useQuery`는 데이터를 가져오기 전까지 `data`가 `undefined`일 수 있습니다.
- 반면, **1급 시민인 `useSuspenseQuery`**는 컴포넌트가 렌더링되는 시점에 **"데이터가 이미 존재함"을 타입 레벨에서 보장**합니다. 개발자는 `if (!data) return ...` 같은 방어적 코드를 작성할 필요가 없습니다.

### ③ 에러 처리의 주도권 (Error Boundary Integration)
- 1급 시민으로서 Suspense 쿼리는 에러 발생 시 부모의 `ErrorBoundary`로 에러를 던지는(Throw) 행위가 기본 동작으로 설계되어 있습니다. 데이터 로딩(Suspense)과 실패(ErrorBoundary) 처리가 선언적으로 하나가 됩니다.

---

## 2. 왜 `@suspensive/react-query`가 여전히 필요한가?

TanStack Query v5가 Suspense를 완벽하게 지원함에도 불구하고, `@suspensive/react-query`는 **"사용자 경험(Developer Experience)"** 측면에서 한 단계 더 나아간 편의성을 제공합니다.

### ① 병렬 쿼리의 결과 구조 (Destructuring)
TanStack Query의 공식 `useSuspenseQueries`는 결과로 객체의 배열을 반환합니다. 반면, `@suspensive/react-query`는 결과를 **튜플(Tuple)** 형태로 다루기 훨씬 쉽게 설계되어 있습니다.

**TanStack Query v5 공식:**
```tsx
const [roomsQuery, reservationsQuery] = useSuspenseQueries({
  queries: [
    { queryKey: ['rooms'], queryFn: getRooms },
    { queryKey: ['reservations'], queryFn: getReservations },
  ],
})
// 데이터에 접근하려면 .data를 명시적으로 타야 함
const rooms = roomsQuery.data
```

**@suspensive/react-query:**
```tsx
const [{ data: rooms }, { data: reservations }] = useSuspenseQueries({
  queries: [
    { queryKey: ['rooms'], queryFn: getRooms },
    { queryKey: ['reservations'], queryFn: getReservations },
  ],
})
// 구조 분해 할당으로 훨씬 직관적이고 타입 안전하게 접근 가능
```

### ② `@suspensive/react` 생태계와의 통합
`@suspensive/react-query`는 단순히 쿼리 훅만 제공하는 것이 아니라, `@suspensive/react`가 지향하는 **"선언적 UI(Declarative UI)"** 철학에 최적화되어 있습니다.
- `Suspense`, `ErrorBoundary`, `QueryErrorBoundary` 등과 결합할 때 시너지가 발생합니다.
- 로딩 상태와 에러 상태를 컴포넌트 내부 로직에서 분리하여 완전히 선언적으로 관리할 수 있게 돕습니다.

---

## 3. 요약: 언제 무엇을 쓸까?

| 비교 항목 | TanStack Query v5 (Native) | @suspensive/react-query |
| :--- | :--- | :--- |
| **기본 사상** | 데이터 페칭 라이브러리의 Suspense 확장 | 선언적 UI 패턴을 위한 Suspense 최적화 |
| **주요 장점** | 추가 의존성 없음, 공식 문서 지원 | **직관적인 구조 분해 할당(튜플)**, 가독성 |
| **추천 케이스** | Suspense만 가볍게 사용하고 싶을 때 | **병렬 호출이 많고**, Suspensive 생태계(ErrorBoundary 등)를 적극 활용할 때 |

---

## 4. 최종 결론: 무엇을 써야 할까? (Decision Guide)

결론적으로, **React 프로젝트에서 Suspense를 적극 활용할 계획이라면 `@suspensive/react-query`가 거의 모든 상황에서 더 나은 선택**입니다.

### ✅ 이런 경우에는 `@suspensive/react-query`를 사용하세요
- **병렬 호출이 잦을 때**: 구조 분해 할당을 통해 코드가 압도적으로 깔끔해집니다.
- **선언적 UI를 지향할 때**: `@suspensive/react`와 함께 사용하면 로딩/에러/성공 상태를 완벽하게 컴포넌트 밖으로 분리할 수 있습니다.
- **v4 이하 환경 (현재 프로젝트)**: TanStack Query v5 이전 버전에서는 전용 Suspense 훅이 없으므로 `@suspensive`를 통해 v5와 유사한(혹은 더 나은) 경험을 미리 누릴 수 있습니다.

### ⚠️ 이런 경우에는 TanStack Query 공식 API만 사용하세요
- 프로젝트에 외부 의존성을 추가하는 것이 엄격히 금지된 경우.
- 앱의 규모가 매우 작아 단순한 `useQuery`만으로도 충분한 경우.

결국 **"복잡한 실무 환경에서 더 생산적이고 안전한 코드를 작성할 수 있게 해주는 도구"**가 `@suspensive/react-query`라고 이해하시면 됩니다.
