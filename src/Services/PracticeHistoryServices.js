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
        });
    },
    getPracticeHistoryFromId(knex, id){
        return knex.select().from('practice_history').where('id', id).first();
    },
    deletePracticeHistory(knex, id){
        return knex('practice_history')
        .where({id})
        .delete();
    },
    updatePracticeHistory(knex, id, new_p_h_Fields){
        return knex('practice_history')
        .where({id})
        .update(new_p_h_Fields);
    },
    /*getAllHistoryBySong(knex, song_id){
        return knex.select().from('practice_history').where('song_practiced')
    } */
}

module.exports = PracticeHistory