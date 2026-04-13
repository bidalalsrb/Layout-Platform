# Layout Platform ERD

## 1) 개요
현재 프론트엔드는 `localStorage` 기반 mock DB(`layout-platform-mock-db-v1`)를 사용한다.
운영 전환 시 동일한 엔티티 구조를 RDB(PostgreSQL/MySQL)로 이전한다.

## 2) ERD (Current/To-Be 공통 모델)
```mermaid
erDiagram
    USER {
      bigint id PK
      varchar user_id UK
      varchar password_hash
      varchar name
      varchar role "ADMIN|USER"
      varchar phone_number
      varchar major
      varchar student_number
      varchar gender
      varchar school_cd
      datetime created_at
      datetime updated_at
    }

    EVENT {
      bigint id PK
      varchar title
      date start_date
      date end_date
      varchar period_text
      varchar manager_name
      text content
      varchar layout_code UK "4-digit"
      varchar status "LAYOUT_PENDING|LAYOUT_READY"
      datetime created_at
      datetime updated_at
    }

    EVENT_POSTER {
      bigint id PK
      bigint event_id FK
      varchar file_name
      varchar file_url
      int sort_order
      datetime created_at
    }

    EVENT_LAYOUT {
      bigint id PK
      bigint event_id FK UK
      int rows
      int cols
      datetime created_at
      datetime updated_at
    }

    LAYOUT_CELL {
      bigint id PK
      bigint layout_id FK
      int cell_order
      varchar label
      varchar name
      text content
      int x_order
      int y_order
      datetime updated_at
    }

    APPLY_REQUEST {
      bigint id PK
      bigint event_id FK
      bigint user_id FK
      bigint cell_id FK
      varchar status "REQUESTED|CANCELED"
      datetime created_at
      datetime updated_at
    }

    EVENT ||--o{ EVENT_POSTER : has
    EVENT ||--|| EVENT_LAYOUT : owns
    EVENT_LAYOUT ||--o{ LAYOUT_CELL : contains
    EVENT ||--o{ APPLY_REQUEST : receives
    USER ||--o{ APPLY_REQUEST : creates
    LAYOUT_CELL ||--o{ APPLY_REQUEST : targets
```

## 3) 제약조건
- `EVENT.layout_code`는 4자리 숫자 문자열이며 유니크
- 배치 코드 발급 시점: 관리자 배치 저장 최초 1회
- `EVENT_LAYOUT`는 이벤트당 정확히 1개
- `LAYOUT_CELL.cell_order`는 같은 `layout_id` 내 유니크

## 4) 현재 구현 매핑
- 저장소: `localStorage` (`layout-platform-mock-db-v1`)
- 이벤트 + 레이아웃 + 셀은 하나의 JSON 트리로 저장
- 코드 발급 로직: 랜덤 1000~9999 중 중복 회피

## 5) 운영 DB 전환 시 권장 인덱스
- `event(layout_code)` UNIQUE INDEX
- `layout_cell(layout_id, cell_order)` UNIQUE INDEX
- `apply_request(event_id, created_at)` INDEX
- `event(start_date, end_date)` INDEX
