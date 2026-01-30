 SELECT "Bid_Construction".id,
    '입찰'::text AS "유형",
    '공사'::text AS "업무구분",
    "Bid_Construction"."입찰공고명" AS "공고명",
    "Bid_Construction"."등록일시" AS "게시일시",
    "Bid_Construction"."공고기관명" AS "공고기관",
    "Bid_Construction"."수요기관명" AS "수요기관",
    "Bid_Construction"."공고종류명" AS "공고종류"
   FROM "Bid_Construction"
UNION ALL
 SELECT "Bid_Foreign".id,
    '입찰'::text AS "유형",
    '외자'::text AS "업무구분",
    "Bid_Foreign"."입찰공고명" AS "공고명",
    "Bid_Foreign"."등록일시" AS "게시일시",
    "Bid_Foreign"."공고기관명" AS "공고기관",
    "Bid_Foreign"."수요기관명" AS "수요기관",
    "Bid_Foreign"."공고종류명" AS "공고종류"
   FROM "Bid_Foreign"
UNION ALL
 SELECT "Bid_Service".id,
    '입찰'::text AS "유형",
    '용역'::text AS "업무구분",
    "Bid_Service"."입찰공고명" AS "공고명",
    "Bid_Service"."등록일시" AS "게시일시",
    "Bid_Service"."공고기관명" AS "공고기관",
    "Bid_Service"."수요기관명" AS "수요기관",
    "Bid_Service"."공고종류명" AS "공고종류"
   FROM "Bid_Service"
UNION ALL
 SELECT "Bid_Thing".id,
    '입찰'::text AS "유형",
    '물품'::text AS "업무구분",
    "Bid_Thing"."입찰공고명" AS "공고명",
    "Bid_Thing"."등록일시" AS "게시일시",
    "Bid_Thing"."공고기관명" AS "공고기관",
    "Bid_Thing"."수요기관명" AS "수요기관",
    "Bid_Thing"."공고종류명" AS "공고종류"
   FROM "Bid_Thing"
UNION ALL
 SELECT "PreStandard".id,
    '사전규격'::text AS "유형",
    "PreStandard"."업무구분명" AS "업무구분",
    "PreStandard"."품명" AS "공고명",
    "PreStandard"."등록일시" AS "게시일시",
    "PreStandard"."발주기관명" AS "공고기관",
    "PreStandard"."실수요기관명" AS "수요기관"
   FROM "PreStandard"
UNION ALL
 SELECT "OrderPlan".id,
    '발주계획'::text AS "유형",
    "OrderPlan"."업무구분명" AS "업무구분",
    "OrderPlan"."사업명" AS "공고명",
    "OrderPlan"."게시일시",
    "OrderPlan"."발주기관명" AS "공고기관",
    NULL::text AS "수요기관"
   FROM "OrderPlan"