import { getRounds, hashSync } from "bcryptjs";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:false, length:60})
  name: string

  @Column({nullable: false, unique:true, length:40})
  email:string

  @Column({nullable:false, length: 100})
  password: string

  @Column({default: false})
  isAdmin: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(){
    const isEncrypted = getRounds(this.password)
    if (!isEncrypted){
      this.password = hashSync(this.password, 8)
    }
  }
}
