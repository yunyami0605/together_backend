import { StudyBoardEntity } from 'src/study/board/entity/board.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'together', name: 'comment' })
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  /**
    writerId INT NOT NULL,
    boardId INT NOT NULL,
    FOREIGN KEY (writerId) REFERENCES together.user(id),
    FOREIGN KEY (boardId) REFERENCES together.studyboard(id)
     */
  @Column('varchar', { name: 'content', length: 255, nullable: false })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'writerId' })
  writerId: number;

  @ManyToOne(() => StudyBoardEntity, (board) => board.id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'boardId' })
  boardId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
