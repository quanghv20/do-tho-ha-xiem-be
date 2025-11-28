import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'JWT_SECRET_KEY',
    });
  }

  validate(payload: { sub: number | string; username: string }) {
    console.log('payload: ', payload);

    // payload = { sub: userId, username }
    return { userId: payload.sub, username: payload.username };
  }
}
