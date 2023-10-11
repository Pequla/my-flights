import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("uq_user_token_token", ["token"], { unique: true })
@Index("fk_user_token_user_idx", ["userId"], {})
@Entity("user_token", { schema: "my_flights" })
export class UserToken {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "user_token_id",
    unsigned: true,
  })
  userTokenId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "token", unique: true, length: 600 })
  token: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.userTokens, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
