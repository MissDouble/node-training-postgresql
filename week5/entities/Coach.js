const {EntitySchema} = require('typeorm')

module.exports = new EntitySchema({
    name: 'coach',
    tableName: 'COACH',
    column:{
        id:{
            primary: true,
            type:'uuid',
            generated: true,
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
            createData: true,
        },
        updated_at:{
            type: 'timestamp',
            nullable: false,
            updateData: true,
        },
        relations:{
            User:{
                target:'User',
                type:'one-to-one',
                inverseSide: 'Coach',
                joinColumn:{
                    name: 'user_id',
                    referencedColumnName: 'user',
                    foreignKeyConstraintName: 'coach_user_id_fk'//這個欄位可以自己取名
                }
            }
        }
    }
})