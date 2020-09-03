const PracticeHistory = {
    getAllPracticeHistory(knex){
        return knex.select().from('practice_history');
    },
    postPracticeHistory(knex, newPracticeHistory){
        return knex
        .insert(newPracticeHistory)
        .into('practice_history')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    getPracticeHistoryFromId(knex, id){
        return knex.select().from('practice_history').where('id', id).first()
    }
}

module.exports = PracticeHistory