exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(24)',
            primaryKey: true
        },
        title: {
            type: 'TEXT',
            notNull: true
        },
        year: {
            type: 'INT',
            notNull: true
        },
        genre: {
            type: 'TEXT',
            notNull: true
        },
        performer: {
            type: 'TEXT',
            notNull: true
        },
        duration: {
            type: 'INT',
            notNull: false
        },
        album_id: {
            type: 'VARCHAR(24)',
            notNull: false
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('songs');
};
