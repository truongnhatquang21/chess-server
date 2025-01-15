export type ExchangeTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_info: {
    exp: number;
    jti: string;
    iat: number;
    iss: string;
    sub: string;
    aud: string[];
    name: string;
    email: string;
    first_login: boolean;
  };
};

export type RawProfile = {
  addr: string;
  atHash: string;
  aud: string[];
  authTime: number;
  createdAt: number;
  deviceInfo: {
    browser: string;
    deviceType: string;
    ip: string;
    name: string;
    os: string;
    raw: string;
  };
  email: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  linkedAt: number;
  name: string;
  rat: number;
  redirectUri: string;
  sid: string;
  status: string;
  sub: string;
  walletType: string;
  roninAddress?: string;
};
