const { age, date } = require('../../lib/utils')
const Teacher = require('./models/teacher')

module.exports = {

    index( req, res ){
        /*
        const { filter } = req.query 
        
        if (filter) {

            Teacher.findBy( filter, function(teacher) {
                return res.render('teachers/index', { teacher, filter } )
            })

        } else {

            Teacher.all( function(teacher) {
                return res.render('teachers/index', { teacher } )
            } )

        }
        */

        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page -1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(teacher) {
                const pagination = {
                    total: Math.ceil(teacher[0].total / limit ),
                    page
                }
                return res.render('teachers/index', {teacher, pagination, filter} )
            }
        }

        Teacher.paginate(params)
    },


    create( req, res ){

        return res.render('teachers/create')

    },

    post( req, res ){

        const keys = Object.keys(req.body)

        for (key of keys){
            if ( req.body[key] == "" ){
                return res.send('Necessário Preecher Todos Os Campos!')
            }
        }

        Teacher.create( req.body, function(teacher) {
            return res.redirect(`/teachers/${teacher.id}`)
        } )
    },

    show( req, res ){

        Teacher.find( req.params.id, function(teacher) {

            if(!teacher) return res.send('Teacher not found!')

            teacher.birth_date = age(teacher.birth_date)
            teacher.subjects_taught = teacher.subjects_taught.split(',')
            teacher.created_at = date(teacher.created_at).format

            return res.render('teachers/show', { teacher } )

        } )

    },


    edit( req, res ){

        Teacher.find( req.params.id, function(teacher) {

            if(!teacher) return res.send('Teacher not found!')

            // Tem que ser o (iso) pq o intl já configura do modo certo
            teacher.birth_date = date(teacher.birth_date).iso

            return res.render('teachers/edit', { teacher } )

        } )

    },

    put( req, res ){

        const keys = Object.keys(req.body)

        for (key of keys){
            if ( req.body[key] == "" ){
                return res.send('Necessário Preecher Todos Os Campos!')
            }
        }

        Teacher.update( req.body, function(){
            return res.redirect(`/teachers/${req.body.id}`)
        } )

    },

    delete( req, res ){

        Teacher.delete( req.body.id, function() {
            return res.redirect(`/teachers`)
        } )

    },
}
