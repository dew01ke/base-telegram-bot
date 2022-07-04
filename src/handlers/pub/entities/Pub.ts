import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';

@Entity()
@Unique(['chatId', 'name'])
export class Pub {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  chatId: number;

  @Column()
  addedBy: number;

  @Column()
  name: string;

  @Column()
  count: number;

  @Column({
    default: new Date(),
    nullable: true,
  })
  lastPickedDate: Date;

  @Column({
    default: new Date(),
    nullable: true,
  })
  createdAt: Date;
}
