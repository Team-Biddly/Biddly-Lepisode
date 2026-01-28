export interface Statistic {
  /**
   * 가입 회원수
   */
  user: {
    /**
     * 오늘 가입한 회원수
     */
    today: number;

    /**
     * 지난 7일간 가입한 회원수
     */
    week: number;

    /**
     * 지난 3일간 가입한 회원수
     */
    threeDays: number;
  };

  /**
   * 불러온 조달 정보
   */
  bid: {
    /**
     * 불러온 발주 계획 수
     */
    plans: number;

    /**
     * 불러온 사전 규격 수
     */
    specs: number;

    /**
     * 불러온 입찰 공고 수
     */
    notices: number;
  };
}
