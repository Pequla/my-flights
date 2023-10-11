import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("fk_user_flight_user_idx", ["userId"], {})
@Entity("user_flight", { schema: "my_flights" })
export class UserFlight {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "user_flight_id",
    unsigned: true,
  })
  userFlightId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("int", { name: "flight_id", unsigned: true })
  flightId: number;

  @ManyToOne(() => User, (user) => user.userFlights, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
