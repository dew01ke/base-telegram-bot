import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

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
  action: string;

  @Column({
    type: 'json'
  })
  modifications: object;

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
