import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserFlight } from "./UserFlight";
import { UserToken } from "./UserToken";

@Index("uq_user_email", ["email"], { unique: true })
@Entity("user", { schema: "my_flights" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => UserFlight, (userFlight) => userFlight.user)
  userFlights: UserFlight[];

  @OneToMany(() => UserToken, (userToken) => userToken.user)
  userTokens: UserToken[];
}
