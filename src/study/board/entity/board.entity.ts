import { CommentEntity } from 'src/comment/entities/comment.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'together', name: 'studyBoard' })
export class StudyBoardEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 40 })
  title: string;

  @Column('varchar', { name: 'content', length: 255 })
  content: string;

  @Column('int', { name: 'togetherType', nullable: false, default: 1 })
  togetherType: number;

  @Column('int', { name: 'contentType1', nullable: false, default: 1 })
  contentType1: number;

  @Column('int', { name: 'contentType2', nullable: false, default: 0 })
  contentType2: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  tagList: string[];

  @Column('int', { name: 'location1', nullable: false, default: 0 })
  location1: number;

  @Column('int', { name: 'location2', default: 1 })
  location2: number;

  @Column('int', { name: 'location3', default: 0 })
  location3: number;

  @Column('int', { name: 'persons' })
  persons: number;

  @Column('varchar', { name: 'period', length: 8 })
  period: string;

  @Column('int', { name: 'view', default: 0, nullable: false })
  view: number;

  @Column('int', { name: 'favorite', default: 0 })
  favorite: number;

  @Column('int', { name: 'likeCount', default: 0 })
  like: number;

  @Column('int', { name: 'dislikeCount', default: 0 })
  dislike: number;

  @ManyToOne(() => UserEntity, (users) => users.id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  // JoinColume의 name은 db column과 일치
  @JoinColumn({ name: 'writerId' })
  writer: number;

  @OneToMany(() => CommentEntity, (comment) => comment.boardId)
  comment: CommentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
