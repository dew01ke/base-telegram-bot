import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { ObjectLiteral } from '@/infrastructure/interfaces/ObjectLiteral';

@Entity()
@Index(['enabled', 'chatId'])
export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  enabled: boolean;

  @Column()
  chatId: number;

  @Column()
  name: string;

  @Column({
    type: 'json'
  })
  admins: number[];

  @Column({
    type: 'json'
  })
  settings: ObjectLiteral<any>;
}
