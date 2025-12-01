import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Role } from 'src/common/enums/role.enum';

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  fullName: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STAFF,
  })
  role: Role;
}
