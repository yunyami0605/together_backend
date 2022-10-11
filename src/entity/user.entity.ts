import { CommentEntity } from 'src/entity/comment.entity';
import { StudyBoardEntity } from 'src/entity/board.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardMemberEntity } from './boardMember.entity';
import { LikeEntity } from './like.entity';

/**
 *@description user entity
 */
@Entity({ schema: 'together', name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', length: 30, default: '' })
  email: string;

  @Column('varchar', {
    name: 'nickname',
    unique: true,
    length: 30,
    default: '',
  })
  nickname: string;

  @Column('varchar', {
    name: 'password',
    length: 100,
    select: false,
    default: '',
  })
  password: string;

  @OneToMany(() => StudyBoardEntity, (studyBoard) => studyBoard.writer)
  studyBoard: StudyBoardEntity[];

  @OneToMany(() => BoardMemberEntity, (boardMember) => boardMember.userId)
  boardMembers: BoardMemberEntity[];

  @OneToMany(() => LikeEntity, (like) => like.userId)
  likes: LikeEntity[];

  @ManyToMany(() => StudyBoardEntity, (studyBoard) => studyBoard.members)
  boards: StudyBoardEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.writerId)
  comment: CommentEntity[];

  @Column('int', { name: 'location1', default: 1 })
  location1: number;

  @Column('int', { name: 'location2', default: 0 })
  location2: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  careerList: [number, number][];

  @Column('varchar', { name: 'imgPath', default: null })
  imgPath: string;

  @Column('varchar', {
    name: 'socialType',
    default: 'normal',
    nullable: false,
  })
  socialType: string;

  @Column('int', { name: 'socialId', default: 0, nullable: false })
  socialID: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
