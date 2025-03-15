const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: "User",
    tableName: "USER",
    columns:{
        id:{
            primary: true,//主鍵 (primary: true) 自動具備唯一性，因此 id 字段不需要額外設置 unique: true。當您設置 primary: true 時，資料庫會確保該字段的值唯一且不為 null。
            type:"uuid",
            generated:"uuid", // 自動生成 UUID
        },
        name:{
            type: "varchar",
            length: 50,
            nullable: false,
        },
        email:{
            type: "varchar",
            length: 320,
            nullable: false,
            unique: true
        },
        role:{
            type: "varchar",
            length: 20,
            nullable: false,
        },
        password:{
            type: "varchar",
            length: 72,
            nullable: false,
            select: false //機敏欄位不希望在下select指令時被撈出來，這樣設定就不會被撈出來 .find()的時候也不會被撈出來
        },
        created_at:{
            type: "timestamp",
            nullable: false,
            createDate: true
        },
        updated_at:{
            type: "timestamp",
            nullable:false,
            updateDate: true
        }
    }
})