import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { StudyBoardEntity } from './board.entity';
import { UserEntity } from './user.entity';

/**
 *@description 게시판 & User, many to many 중간 테이블
 */
@Entity({ schema: 'together', name: 'boardmember' })
export class BoardMemberEntity extends BaseEntity {
  @PrimaryColumn({ type: 'int', name: 'boardId' })
  @ManyToOne(() => StudyBoardEntity, (board) => board.boardMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'boardId', referencedColumnName: 'id' })
  boardId: number;

  @PrimaryColumn({ type: 'int', name: 'userId' })
  @ManyToOne(() => UserEntity, (user) => user.boardMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  userId: number;
}
