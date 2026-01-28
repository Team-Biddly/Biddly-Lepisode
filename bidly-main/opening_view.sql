CREATE OR REPLACE VIEW opening AS
SELECT id, '입찰' as "유형", '공사' as "업무구분", "입찰공고명" as "공고명", "등록일시" as "게시일시", "공고기관명" as "공고기관", "수요기관명" as "수요기관" FROM "Bid_Construction"
UNION ALL
SELECT id,  '입찰' as "유형",'외자' as "업무구분", "입찰공고명" as "공고명", "등록일시" as "게시일시", "공고기관명" as "공고기관", "수요기관명" as "수요기관" FROM "Bid_Foreign"
UNION ALL
SELECT id,  '입찰' as "유형", '용역' as "업무구분","입찰공고명" as "공고명", "등록일시" as "게시일시", "공고기관명" as "공고기관", "수요기관명" as "수요기관" FROM "Bid_Service"
UNION ALL
SELECT id,  '입찰' as "유형", '물품' as "업무구분","입찰공고명" as "공고명", "등록일시" as "게시일시", "공고기관명" as "공고기관", "수요기관명" as "수요기관" FROM "Bid_Thing"
UNION ALL
SELECT id,  '사전규격' as "유형", "업무구분명" as "업무구분","품명" as "공고명", "등록일시" as "게시일시", "발주기관명" as "공고기관", "실수요기관명" as "수요기관" FROM "PreStandard"
UNION ALL
SELECT id, '발주계획' as "유형", "업무구분명" as "업무구분", "사업명" as "공고명", "게시일시" as "게시일시", "발주기관명" as "공고기관", NULL as "수요기관" FROM "OrderPlan";
