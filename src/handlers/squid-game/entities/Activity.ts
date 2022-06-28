import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { Actions, Modifications } from '@/handlers/squid-game/utils/messageDecomposition';

@Entity()
@Index(['chatId', 'day', 'month'])
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  chatId: number;

  @Column()
  userId: number;

  @Column()
  action: Actions;

  @Column({
    type: 'json'
  })
  modifications: Modifications[];

  @Column()
  day: number;

  @Column()
  month: number;

  @Column({
    default: new Date(),
    nullable: true,
  })
  createdAt: Date;
}
