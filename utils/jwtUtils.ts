import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  exp: number;
};

export const getTokenExpiry = (accessToken: string | null) => {
  if (!accessToken) {
    return null;
  }
  try {
    const decoded: JwtPayload = jwtDecode(accessToken);
    const expiryInMillis = decoded.exp * 1000;
    const expiryDate = new Date(expiryInMillis);
    return expiryDate;
  } catch (error) {
    console.error('Tokenni dekodlab bo\'lmadi:', error);
    return null;
  }
};
