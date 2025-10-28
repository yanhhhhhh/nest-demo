import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class IdCard {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    length: 50,
    comment: '身份证号码',
  })
  cardNumber: string;

  @JoinColumn()
  @OneToOne(() => User, {
    cascade: true, // 启用级联操作，允许在保存身份证时自动保存关联的用户实体
    onDelete: 'CASCADE', // 当用户被删除时，级联删除对应的身份证
    onUpdate: 'CASCADE', // 当用户的主键被更新时，级联更新对应的身份证
  })
  user: User;
}
