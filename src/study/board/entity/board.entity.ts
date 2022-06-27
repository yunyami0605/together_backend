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

  @Column('varchar', { name: 'content', length: 1000 })
  content: string;

  @Column('varchar', { name: 'type' })
  type: string;

  @Column('varchar', { name: 'location' })
  location: string;

  @Column('int', { name: 'persons' })
  persons: number;

  @Column('datetime', { name: 'period' })
  period: string;

  @Column('int', { name: 'view', default: 0, nullable: false })
  view: number;

  @Column('int', { name: 'favorite', default: 0 })
  favorite: number;

  @Column('int', { name: 'likeCount', default: 0 })
  like: number;

  @Column('int', { name: 'dislikeCount', default: 0 })
  dislike: number;

  @Column('int', { name: 'authorId', nullable: false })
  authorId: number;
  // @Column('varchar', { name: 'tag_list' })
  // tagList: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
