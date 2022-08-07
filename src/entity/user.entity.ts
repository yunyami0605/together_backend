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

@Entity({ schema: 'together', name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @Column('varchar', { name: 'nickname', unique: true, length: 30 })
  nickname: string;

  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @OneToMany(() => StudyBoardEntity, (studyBoard) => studyBoard.writer)
  studyBoard: StudyBoardEntity[];

  @OneToMany(() => BoardMemberEntity, (boardMember) => boardMember.userId)
  boardMembers: BoardMemberEntity[];

  @ManyToMany(() => StudyBoardEntity, (studyBoard) => studyBoard.members)
  boards: StudyBoardEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.writerId)
  comment: CommentEntity[];
}
