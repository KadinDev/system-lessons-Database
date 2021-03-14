const intl = require('intl')

const db = require('../../../config/db')
const { age, date } = require('../../../lib/utils')

module.exports = {
    
    /*

    -> ASSIM É APENAS PARA MOSTRAR NO INDEX OS DADOS CADASTRADOS <-

    all(callback) {
        db.query( 'SELECT * FROM students', function(err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        } )
    }
    */

    all(callback) {
        db.query( `
            SELECT * FROM students
            ORDER BY name ASC
            `, function(err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        } )
    },

    create(data, callback) {
        
    // Esses nomes abaixo tem que estarem iguais no form tbm
        const query = `
            INSERT INTO students (
                avatar_url,
                name,
                birth,
                email,
                formaction,
                hobby,
                teacher_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).format,
            data.email,
            data.formaction,
            data.hobby,
            data.teacher
        ]

        db.query( query, values, function( err, results ) {
            
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },

    find( id, callback ) {

        db.query( `
                SELECT students. *, teachers.name AS teacher_name
                FROM students
                LEFT JOIN teachers ON (students.teacher_id = teachers.id)
                WHERE students.id = $1`, [id], function( err, results ){

                if (err) throw `Database Error! ${err}`

                callback(results.rows[0])
            } 
        )
    },

    findBy( filter, callback) {
        db.query(`
        SELECT students. *, count(students) AS total_students
        FROM students
        WHERE students.name ILIKE '%${filter}%'
        OR students.email ILIKE '%${filter}%'
        ` , function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },

    update( data, callback ) {

        const query = `
            UPDATE students SET
            avatar_url=($1),
            name=($2),
            birth=($3),
            email=($4),
            formaction=($5),
            hobby=($6),
            teacher_id=($7)
            WHERE id = $8
        `

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.email,
            data.formaction,
            data.hobby,
            data.teacher,
            data.id
        ]

        db.query( query, values, function( err, results ) {
            if (err) throw `Database Error! ${err}`

            callback()
        } )
    },

    delete( id, callback ) {

        db.query(` DELETE FROM students WHERE id = $1 `, [id], function( err, results ) {
            if(err) throw `Database Error! ${err}`

            return callback()
        })

    },

    teachersSelectOptions(callback){
        db.query(`
            SELECT name, id FROM teachers`, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },

    paginate(params) {
        const { filter, limit, offset, callback } = params
        
        let query = '',
            filterQuery = '',
            totalQuery = `(
                SELECT count(*) FROM students
            ) AS total `

        if (filter){
            filterQuery = `
            WHERE students.name ILIKE '%${filter}%'
            OR students.email ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM students
                ${filterQuery}
            ) AS total `
        }

        query = `
        SELECT students.*, ${totalQuery}
        FROM students
        ${filterQuery}
        LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function(err, results){
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        } )
    }
}
