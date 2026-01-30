import { Color } from '../common/types';

export type CalendarMetadata = {};

export type CalendarEvent = {
  id?: string;
  title: string;
  startDate: Date;
  endDate: Date;
  /**
   * 종일 이벤트 여부
   * @default false
   * (false일 경우 시간 포함)
   */
  allDay?: boolean;
  /**
   * 이벤트 색상
   */
  color?: Color | string;
  /**
   * 반복 여부
   */
  repeat?: boolean;
  /**
   * 메타데이터
   */
  metadata?: CalendarMetadata;
};

export const BLOCK_CALENDAR_GAP = 8;
export const BLOCK_CALENDAR_DEFAULT_TOP = 56; // 이벤트의 기본 top 값

export const TIMELINE_CALENDAR_DEFAULT_TOP = 8; // 이벤트의 기본 top 값
export const TIMELINE_CALENDAR_EVENT_GAP = 8; // 이벤트 끼리의 간격

export type CalendarMode = 'day' | 'week' | 'month';

export type CalendarEventMenu = 'edit' | 'delete' | 'copy'; // 이벤트 메뉴(수정,삭제,복제 등..)

export type CalendarOptions = {
  /**
   * 일/주/월 중 택1
   */
  mode?: CalendarMode;
  day?: {
    /**
     * 날짜 클릭 활성화 여부
     */
    selected?: boolean;
  };
  event?: {
    /**
     * 이벤트 리사이징 활성화 여부
     */
    resize?: boolean;
    /**
     * 이벤트 드롭 활성화 여부
     */
    drop?: boolean;
    /**
     * 이벤트 클릭 활성화 여부
     */
    selected?: boolean;

    /**
     * 이벤트 생성 활성화 여부
     */
    create?: boolean;

    /**
     * 이벤트 수정 활성화 여부
     */
    update?: boolean;

    /**
     * 이벤트 삭제 활성화 여부
     */
    delete?: boolean;

    /**
     * 이벤트 복사 활성화 여부
     */
    copy?: boolean;
  };

  /**
   * default일 시 내장 폼 사용
   * custom일 시 사용자 정의 폼 사용
   */
  form?: 'default' | 'custom';

  /**
   * 모바일 설정
   */
  mobile?: {
    /**
     * 이벤트 리스트 보이기 여부
     */
    showEventList?: boolean;
  };

  /**
   * 로컬스토리지 사용 여부 (캘린더 상태 저장)
   * @defaut true
   */
  useLocalStorage?: boolean;
};

// options의 form이 custom일 때 사용하는 인터페이스
export type CalendarCustomFormEventOutput = {
  date?: Date;
  event?: CalendarEvent;
};

// day 클릭 시 발생하는 이벤트
export type CalendarDayClickOutput = {
  date: Date;
  events: CalendarEvent[];
};

export type CalendarEventChangeOutput =
  | {
      event: CalendarEvent;
      type: 'create' | 'update' | 'delete' | 'drop' | 'resize';
    }
  | CalendarCopyEventOutput;

export type CalendarCopyEventOutput = {
  event: CalendarEvent; // 복제할 이벤트
  copyEvent: CalendarEvent; // 복제된 이벤트
  type: 'copy';
};

export type TimelineSlot = {
  time: string;
  day: string;
  events: CalendarEvent[];
};

export const MONTH_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const TIME_LIST = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

export const eventMenus: {
  label: string;
  value: CalendarEventMenu;
  icon: string;
}[] = [
  {
    label: '수정',
    value: 'edit',
    icon: 'ic:round-drive-file-rename-outline',
  },
  { label: '복제', value: 'copy', icon: 'ic:baseline-content-copy' },
  { label: '삭제', value: 'delete', icon: 'material-symbols:delete-outline' },
];
