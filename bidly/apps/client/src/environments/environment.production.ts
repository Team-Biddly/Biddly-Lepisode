export const environment = {
  state: 'local',
  baseUrl: 'https://biddly.kr',
  local: {
    s3: {
      containerName: 'biddly',
    },
  },
  kakao: {
    redirectUri: 'https://biddly.kr/login/kakao',
    clientId: '8e30a7076abe1c456e36c96065013f35',
  },
  google: {
    redirectUri: 'https://biddly.kr/login/google',
    clientId:
      '1086963685141-2dmeuljufohkhvl5cihdlq6ttk6ps95j.apps.googleusercontent.com',
    clientSecret: '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',
  },
  serviceKey:
    'SJeNb2SwQyPhlAPyXgxvIwJ6sf14r9ETtsFF3qRutlLE7BXdAEIYVGoBIj3oDA+ZDMALiSLXUbfvuMEgSefkaw==',
};
