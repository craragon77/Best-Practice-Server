const PracticeHistory = {
    getAllPracticeHistory(knex){
        return knex.select().from('practice_history');
    }
}

module.exports = PracticeHistory