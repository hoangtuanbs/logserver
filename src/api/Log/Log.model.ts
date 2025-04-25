// src/entity/Log.ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("log")
export class Log
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP", nullable: false })
    inserted_at: Date;

    @Column({ type: "json", nullable: false })
    json: object;
}