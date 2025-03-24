const {EntitySchema} = require('typeorm')

module.exports = new EntitySchema({
    name: 'Coach',
    tableName: 'COACH',
    columns:{
        id:{
            primary: true,
            type:'uuid',
            generated: 'uuid',//id 欄位的 type 是 uuid，但 generated: true 預設是 bigint,TypeORM 預設 generated: true 會產生 bigint，但 uuid 需要手動設定 generated: 'uuid'
            nullable:false
        },
        user_id:{
            type: "uuid",
            nullable: false,
            unique: true,
        },
        experience_years:{
            type: "integer",
            nullable:false
        },
        description:{
            type:'text',
            nullable: false
        },
        profile_image_url:{
            type:'varchar',
            length: 2048,
            nullable:true //教練可以不一定要上傳大頭照
        },
        created_at:{
            type: 'timestamp',
            nullable: false,
            createDate: true,
        },
        updated_at:{
            type: 'timestamp',
            nullable: false,
            updateDate: true,
        },
    },
    relations:{
        User:{
            target:'User',
            type:'one-to-one',
            inverseSide: 'Coach',
            joinColumn:{
                name: 'user_id',
                referencedColumnName: 'id',
                foreignKeyConstraintName: 'coach_user_id_fk'//這個欄位可以自己取名
            }
        }
    }
})