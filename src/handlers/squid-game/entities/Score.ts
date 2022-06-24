import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: number;

  @Column()
  userId: number;

  @Column({
    type: 'json'
  })
  tags: object;

  @Column()
  day: number;

  @Column({
    default: new Date(),
    nullable: true,
  })
  createdAt: Date;
}
